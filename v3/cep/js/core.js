/* ══════════════════════════════════════════════════════════════════
   core.js — shared shell: context store, hash router, analytics,
   delegated actions, modal/toast and the shared summary rail.
   One context store is shared by every entry point (PRD §3).
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var FX = window.CEP_FX, E = window.CEP_ENGINE;
  var KEY = "cep.proto.v5";
  var CEP = window.CEP = { FX: FX, E: E, routes: {}, act: {}, inp: {}, views: {} };

  /* ── state ────────────────────────────────────────────────────── */
  function newSession() { return "S-" + Math.random().toString(36).slice(2, 8).toUpperCase() + "-" + Date.now().toString(36).slice(-4).toUpperCase(); }
  function fresh() {
    return {
      v: 1, session: newSession(), participant: "", variant: "guided",
      ctx: { industry: null, size: null, region: "na", cloud: "crm", goals: [], freeText: "", suggested: [], skipped: false },
      view: { period: "mo", audience: "new" },
      me: { signedIn: false, email: "", name: "" }, pendingGate: null,
      pub: { ed: null, seats: null, billing: "annual", accepted: {}, declined: {}, actions: 0, currency: "USD", model: "prepurchase", saved: [], compare: [], next: null, lastRoute: "#/explore", browseProduct: "all" },
      trial: { state: null, tasks: [], kind: null },
      hand: { consent: false, name: "", email: "", company: "", phone: "", sent: false, declined: false, include: { goals: true, products: true, estimate: true, assumptions: true, context: true } },
      acct: { role: null, signedIn: false, mode: null,
        cart: null,
        orders: [] },
      seller: { auth: false, A: null, B: null, exported: false },
      rs: { failures: {}, showServices: true, open: false },
      events: []
    };
  }
  /* Persistence policy (v4.2): nothing is kept across visits for people who
     aren't signed in. The working state lives in sessionStorage (cleared when
     the tab or browser session ends). Saved estimates belong to a signed-in
     (simulated) account and are stored per email in localStorage, so they come
     back only when that person signs in again. */
  var ACCT_PREFIX = "cep.v5.saved::";
  try { localStorage.removeItem(KEY); localStorage.removeItem("cep.proto.v3"); localStorage.removeItem("cep.proto.v2"); localStorage.removeItem("cep.proto.v1"); } catch (e) { /* */ }
  CEP.loadAccountSaves = function (email) { try { var r = localStorage.getItem(ACCT_PREFIX + email.toLowerCase()); return r ? JSON.parse(r) : []; } catch (e) { return []; } };
  function load() {
    try { var raw = sessionStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.v === 1) return merge(fresh(), s); } } catch (e) { /* storage unavailable */ }
    return fresh();
  }
  function merge(a, b) {
    Object.keys(b).forEach(function (k) {
      if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object" && !Array.isArray(a[k])) merge(a[k], b[k]);
      else a[k] = b[k];
    });
    return a;
  }
  CEP.S = load();
  if (!CEP.S.seller.A) { CEP.S.seller.A = JSON.parse(JSON.stringify(FX.commit.scenarios.A)); CEP.S.seller.B = JSON.parse(JSON.stringify(FX.commit.scenarios.B)); }
  CEP.save = function () {
    try { sessionStorage.setItem(KEY, JSON.stringify(CEP.S)); } catch (e) { /* ignore */ }
    try { var me = CEP.S.me; if (me && me.signedIn && me.email) localStorage.setItem(ACCT_PREFIX + me.email.toLowerCase(), JSON.stringify(CEP.S.pub.saved || [])); } catch (e) { /* ignore */ }
  };
  CEP.reset = function (keepVariant) {
    var v = CEP.S.variant, p = CEP.S.participant;
    CEP.S = fresh();
    CEP.S.seller.A = JSON.parse(JSON.stringify(FX.commit.scenarios.A)); CEP.S.seller.B = JSON.parse(JSON.stringify(FX.commit.scenarios.B));
    if (keepVariant) { CEP.S.variant = v; CEP.S.participant = p; }
    CEP.save();
  };

  /* ── analytics (R27). Local only. ─────────────────────────────── */
  CEP.track = function (name, props) {
    var e = { t: new Date().toISOString(), session: CEP.S.session, variant: CEP.S.variant, route: location.hash || "#/", event: name };
    if (props) e.props = props;
    // de-duplicate identical events caused by re-rendering the same view
    var last = CEP.S.events[CEP.S.events.length - 1];
    if (last && last.event === name && last.route === e.route && JSON.stringify(last.props || null) === JSON.stringify(e.props || null)) return;
    CEP.S.events.push(e);
    if (CEP.S.events.length > 2000) CEP.S.events.shift();
    CEP.save();
    if (CEP.onEvent) CEP.onEvent(e);
  };

  /* ── html helpers ─────────────────────────────────────────────── */
  var esc = CEP.esc = function (s) { return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  CEP.money = E.money; CEP.credits = E.credits;
  /* ── display period (monthly by default, annual on toggle). Display only:
     it never changes billing terms. Monthly = annual ÷ 12. ───────────── */
  CEP.isMo = function () { return !CEP.S.view || CEP.S.view.period !== "yr"; };
  CEP.pv = function (annual) { return CEP.isMo() ? annual / 12 : annual; };
  CEP.sfx = function () { return CEP.isMo() ? "/mo" : "/yr"; };
  CEP.p = function (annual) { return annual === null || annual === undefined ? "Not priced" : E.money(CEP.pv(annual)) + "<small>" + CEP.sfx() + "</small>"; };
  CEP.pt = function (annual) { return annual === null || annual === undefined ? "Not priced" : E.money(CEP.pv(annual)) + CEP.sfx(); };
  /* unit prices: price is per month unless unit says /yr (annual-priced). */
  CEP.uv = function (price, annualPriced) { return CEP.isMo() ? (annualPriced ? price / 12 : price) : (annualPriced ? price : price * 12); };
  CEP.pu = function (price, unit) { // unit e.g. "user/mo", "org/mo", "1K profiles/yr", "100K credits"
    if (price === null || price === undefined) return "Priced by Sales";
    var m = /^(.*)\/(mo|yr)$/.exec(unit || "");
    if (!m) return E.money(price) + (unit ? " per " + unit : "");
    var v = CEP.uv(price, m[2] === "yr"), n = Math.round(v * 100) / 100;
    return (n % 1 ? "$" + n.toFixed(2) : E.money(n)) + "/" + m[1] + CEP.sfx();
  };
  CEP.perUnitLbl = function (u) { return "per " + u + "/" + (CEP.isMo() ? "month" : "year"); };
  CEP.partialWhy = function (est) {
    if (!est.partial) return "";
    if (!est.priceable) return "Prices aren't available for your region or currency. ";
    var parts = [];
    var unp = est.lines.filter(function (l) { return l.amount === null && !l.incompatible; }).map(function (l) { return l.label; });
    var inc = est.lines.filter(function (l) { return l.incompatible; }).map(function (l) { return l.label; });
    if (unp.length) parts.push(unp.join(", ") + (unp.length > 1 ? " aren't" : " isn't") + " priced, so not included");
    if (inc.length) parts.push(inc.join(", ") + (inc.length > 1 ? " aren't" : " isn't") + " available with this edition, so not included");
    if (est.hasFrom) parts.push("includes a starting price, so the final cost may be higher");
    return parts.length ? parts.join("; ").replace(/^./, function (c) { return c.toUpperCase(); }) + ". " : "";
  };
  CEP.perLbl = function () { return CEP.isMo() ? "per month" : "per year"; };
  CEP.billNote = function (monthlyBilled) { return CEP.isMo() ? (monthlyBilled ? "billed monthly" : "monthly equivalent, billed annually") : (monthlyBilled ? "12 monthly payments" : "billed annually"); };
  CEP.periodToggle = function (id) {
    var yr = !CEP.isMo();
    return '<div class="cep-period-w"><div class="cep-period"><span id="' + id + '-l" class="cep-period__l">Show prices</span><span class="cep-period__o' + (yr ? "" : " is-on") + '" aria-hidden="true">Monthly</span>' +
      '<button type="button" class="cep-tgl' + (yr ? " is-on" : "") + '" role="switch" aria-checked="' + yr + '" aria-labelledby="' + id + '-l" aria-describedby="' + id + '-d" data-act="period" id="' + id + '"><span class="cep-tgl__k"></span></button>' +
      '<span class="cep-period__o' + (yr ? " is-on" : "") + '" aria-hidden="true">Annual</span></div>' +
      '<p class="cep-period__note" id="' + id + '-d"><span class="sx-vh">' + (yr ? "Showing annual prices. " : "Showing monthly prices. ") + "</span>Only changes how prices are shown. Billing is set by your contract or plan.</p></div>";
  };
  /* ── Trailblazer ID-style sign-in (simulated), shared by the customer
     sign-in page and the prospect Save / Compare / Download / Trial gate.
     o: { ctx: "customer"|"prospect", mode: "signin"|"create", email, err, purpose } */
  CEP.tbid = function (o) {
    var create = o.mode === "create";
    var accts = [["google.png", "Google"], ["salesforce-mark.svg", "Salesforce"], ["mulesoft-mark.svg", "MuleSoft"], ["spiff-mark.svg", "Spiff"]];
    var h = '<div class="cep-tb" data-ctx="' + o.ctx + '">' +
      '<img class="cep-tb__logo" src="assets/login/salesforce-lockup.svg" alt="Salesforce" />' +
      '<p class="cep-tb__badge">Trailblazer ID sign-in (simulated)</p>' +
      '<h2 class="cep-tb__title" id="tb-title">' + (create ? "Create your Trailblazer account" : "Choose an account") + "</h2>" +
      '<p class="cep-tb__sub">' + esc(o.purpose) + "</p>";
    if (!create) h += '<div class="cep-tb__accts">' + accts.map(function (a) { return '<button type="button" class="cep-tb__acct" data-act="tbAccount" data-ctx="' + o.ctx + '"><img src="assets/login/' + a[0] + '" alt="" width="16" height="16" /> ' + a[1] + "</button>"; }).join("") + '</div><div class="cep-tb__or" aria-hidden="true">Or</div>';
    h += '<form class="cep-tb__form" data-ctx="' + o.ctx + '" novalidate>' +
      (create ? '<label class="cep-tb__field" for="tb-n">Full name<input id="tb-n" type="text" autocomplete="name" /></label><label class="cep-tb__field" for="tb-c">Company<input id="tb-c" type="text" autocomplete="organization" /></label>' : "") +
      '<label class="cep-tb__field" for="tb-e">Business email<input id="tb-e" type="email" autocomplete="username" value="' + esc(o.email || "") + '"' + (o.err ? ' aria-invalid="true" aria-describedby="tb-err"' : "") + " /></label>" +
      (o.err ? '<p class="sx-err" id="tb-err" role="alert">' + esc(o.err) + "</p>" : "") +
      '<label class="cep-tb__field" for="tb-p">Password<input id="tb-p" type="password" autocomplete="' + (create ? "new-password" : "current-password") + '" placeholder="Any value works in this prototype" /></label>' +
      '<button type="submit" class="sf-cta sf-cta--primary sf-cta--hero cep-tb__next" data-act="tbSubmit" data-ctx="' + o.ctx + '">' + (create ? "Sign up" : "Log in") + "</button></form>" +
      '<p class="cep-tb__fine">' + (create ? 'Already have an account? <button type="button" data-act="tbMode" data-ctx="' + o.ctx + '" data-v="signin">Log in</button>.' :
        'Explore <button type="button" data-act="tbBenefits">Trailblazer account benefits</button>.' + (o.ctx === "prospect" ? '<br>Don’t have an account? <button type="button" data-act="tbMode" data-ctx="' + o.ctx + '" data-v="create">Sign up for free</button>.' : "")) + "</p>" +
      '<p class="cep-tb__sim">Simulated. No real account or password is checked, and nothing is sent.</p></div>';
    return h;
  };
  CEP.act.tbBenefits = function () { CEP.toast("Trailblazer account benefits (not part of this prototype)"); };
  CEP.act.tbSubmit = function (el) { var c = el.getAttribute("data-ctx"); if (c === "customer") CEP.act.signIn(); else CEP.act.gateSubmit(); };
  CEP.act.tbAccount = function (el) { // choosing an account signs in with a sample email
    var c = el.getAttribute("data-ctx"), f = document.getElementById("tb-e");
    if (f && !f.value) f.value = c === "customer" ? "jordan.lee@northwind.example" : "alex.kim@example.com";
    CEP.act.tbSubmit(el);
  };
  document.addEventListener("submit", function (e) { var f = e.target.closest(".cep-tb__form"); if (f) { e.preventDefault(); CEP.act.tbSubmit(f); } });
  CEP.act.period = function () { CEP.S.view = CEP.S.view || {}; CEP.S.view.period = CEP.isMo() ? "yr" : "mo"; CEP.track("price_assumptions_changed", { display: CEP.S.view.period }); CEP.save(); CEP.render(); };
  CEP.ic = {
    check: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#2E844A"/><path d="M5.8 10.3l2.7 2.7 5.6-5.9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    part: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#fff" stroke="#DD7A01" stroke-width="2"/><path d="M10 1.5a8.5 8.5 0 0 1 0 17z" fill="#DD7A01"/></svg>',
    gap: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#fff" stroke="#BA0517" stroke-width="2"/><path d="M6.5 10h7" stroke="#BA0517" stroke-width="2.2" stroke-linecap="round"/></svg>',
    cross: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#BA0517"/><path d="M6.6 6.6l6.8 6.8M13.4 6.6l-6.8 6.8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9v5M10 6.2v.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    lock: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="9" width="12" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    ext: '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M11 3h6v6M17 3l-8 8M15 12v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warn: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.5l8 14.5H2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 8v4M10 14.5v.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  var tipN = 0;
  CEP.resetTips = function () { tipN = 0; };
  CEP.infoTip = function (label, text) {
    tipN += 1;
    var id = "cep-tip-" + tipN;
    return '<button type="button" class="cep-tip" aria-label="' + esc("More about " + label) + '" aria-describedby="' + id + '">' +
      CEP.ic.info +
      '<span id="' + id + '" class="cep-tip__pop" role="tooltip">' + esc(text) + "</span></button>";
  };
  CEP.status = function (st) {
    var map = {
      illustrative: ["is-from", "Illustrative list price"], partial: ["is-sub", "Partial total"], from: ["is-sub", "Starting price"],
      unpriced: ["is-pre", "Not priced"], included: ["is-est", "Included"], incompatible: ["is-sub", "Not compatible"],
      synthetic: ["is-pre", "Synthetic"], simulated: ["is-pre", "Simulated"], concept: ["is-sub", "Concept only"], live: ["is-est", "Live trial"]
    };
    var m = map[st] || ["is-pre", st];
    return '<span class="sx-chip ' + m[0] + '">' + esc(m[1]) + "</span>";
  };
  CEP.amt = function (l) {
    if (l.included) return '<span class="sx-amt sx-amt--i">Included</span>';
    if (l.incompatible) return '<span class="sx-amt sx-amt--c">Excluded</span>';
    if (l.amount === null) return '<span class="sx-amt sx-amt--c">Not priced</span>';
    return '<span class="sx-amt">' + (l.status === "from" ? "from " : "") + CEP.p(l.amount) + "</span>";
  };
  CEP.crumbs = function (steps, cur) {
    return '<nav class="est-crumbs" aria-label="Estimator steps"><ol class="est-crumbs__list">' + steps.map(function (s, i) {
      var cls = i < cur ? "crumb--done" : (i === cur ? "crumb--current" : "crumb--future");
      var inner = '<span class="crumb-n">' + (i + 1) + '</span><span class="crumb-l">' + esc(s[0]) + "</span>";
      var el = i < cur && s[1] ? '<a class="crumb ' + cls + '" href="' + s[1] + '">' + inner + "</a>" : '<span class="crumb ' + cls + '"' + (i === cur ? ' aria-current="step"' : "") + ">" + inner + "</span>";
      var sep = i < steps.length - 1 ? '<i class="icon icon--chevronright crumb-sep" aria-hidden="true"></i>' : "";
      return '<li class="crumb-item">' + el + sep + "</li>";
    }).join("") + "</ol></nav>";
  };
  CEP.note = function (kind, html) { return '<div class="sx-note' + (kind === "w" ? " sx-note--w" : kind === "e" ? " cep-note--e" : kind === "ok" ? " cep-note--ok" : "") + '" role="' + (kind === "e" ? "alert" : "note") + '">' + html + "</div>"; };

  /* ── toast + modal ────────────────────────────────────────────── */
  CEP.toast = function (msg) {
    var t = document.getElementById("sx-toast"); if (!t) return;
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(CEP._tt); CEP._tt = setTimeout(function () { t.classList.remove("is-on"); }, 2600);
  };
  CEP.modal = function (title, body, opts) {
    opts = opts || {};
    CEP._lastFocus = document.activeElement;
    var root = document.getElementById("modal-root");
    root.innerHTML = '<div class="sx-modal" role="dialog" aria-modal="true" aria-labelledby="mdl-t"><div class="sx-modal__scrim" data-act="closeModal"></div>' +
      '<div class="sx-modal__card' + (opts.wide ? " is-wide" : "") + '" tabindex="-1"><div class="sx-mh"><h2 class="sx-h3" id="mdl-t">' + esc(title) + '</h2><button class="sx-x sx-x--lg" data-act="closeModal" aria-label="Close dialog">✕</button></div><div class="cep-mb">' + body + "</div></div></div>";
    document.body.classList.add("sx-lock");
    var card = root.querySelector(".sx-modal__card"); card.focus();
  };
  CEP.closeModal = function () {
    var root = document.getElementById("modal-root"); root.innerHTML = ""; document.body.classList.remove("sx-lock");
    if (CEP._lastFocus && CEP._lastFocus.focus) try { CEP._lastFocus.focus(); } catch (e) { /* */ }
  };
  CEP.act.closeModal = CEP.closeModal;
  document.addEventListener("keydown", function (e) {
    var root = document.getElementById("modal-root");
    if (e.key === "Escape" && root && root.innerHTML) { CEP.closeModal(); return; }
    if (e.key === "Tab" && root && root.innerHTML) { // focus trap
      var f = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  CEP.download = function (name, text, type) {
    try {
      var b = new Blob([text], { type: type || "text/plain" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name;
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      return true;
    } catch (e) { return false; }
  };
  CEP.copy = function (text) {
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text); return true; } } catch (e) { /* */ }
    try { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); var ok = document.execCommand("copy"); ta.remove(); return ok; } catch (e) { return false; }
  };

  /* ── public estimate selection helpers ───────────────────────── */
  CEP.modOk = function (m, edId) {
    if (!m) return false;
    var inc = m.includedIn && m.includedIn.indexOf(edId) >= 0;
    return inc || m.reqEd.indexOf(edId) >= 0;
  };
  /* Drop add-ons that the current edition cannot include. Does not
     restore them if the buyer later switches back to a higher edition. */
  CEP.pruneAccepted = function (edId) {
    var acc = CEP.S.pub.accepted || {};
    var e = edId || CEP.S.pub.ed;
    if (!e) return;
    var changed = false;
    Object.keys(acc).forEach(function (id) {
      if (!CEP.modOk(E.mod(id), e)) { delete acc[id]; changed = true; }
    });
    if (changed) CEP.save();
  };
  CEP.sel = function () {
    var S = CEP.S, sz = E.size(S.ctx.size);
    if (!S.ctx.cloud) S.ctx.cloud = "crm";
    CEP.pruneAccepted(S.pub.ed);
    return { ed: S.pub.ed, seats: S.pub.seats || (sz ? sz.seats : 10), billing: S.pub.billing, accepted: S.pub.accepted,
      actions: S.pub.actions, region: S.ctx.region, currency: S.pub.currency, goals: S.ctx.goals, showServices: S.rs.showServices,
      industry: S.ctx.industry, cloud: S.ctx.cloud };
  };
  CEP.viewEd = function (id) {
    if (!id) return null;
    var S = CEP.S;
    return E.suiteEd(id, S.ctx.industry, S.ctx.cloud || "crm") || E.ed(id);
  };
  CEP.cloudLabel = function (id) {
    var c = window.CEP_SUITES && window.CEP_SUITES.cloud(id || CEP.S.ctx.cloud || "crm");
    return c ? c.label : "Sales & Service";
  };
  CEP.est = function () { return CEP.S.pub.ed ? E.estimate(CEP.sel()) : null; };

  /* ── sticky summary rail (PRD §3 Navigation) ─────────────────── */
  /* Enterprise (1,000+ employees): no estimates; pricing is tailored by Sales. */
  CEP.isEnt = function () { return CEP.S.ctx.size === "ent"; };
  CEP.rail = function () {
    var S = CEP.S, est = CEP.est(), ent = CEP.isEnt();
    var ctx = [];
    var ind = S.ctx.industry && FX.industries.filter(function (i) { return i.id === S.ctx.industry; })[0];
    var sz = E.size(S.ctx.size), rg = E.region(S.ctx.region);
    if (ind) ctx.push(ind.name);
    ctx.push(CEP.cloudLabel(S.ctx.cloud));
    if (sz) ctx.push(sz.range); if (rg) ctx.push(rg.name);
    var h = '<aside class="sx-cv" aria-label="Your plan summary"><div class="sx-cv__head"><h2 class="sx-cv__title">Running estimate</h2>' + (est && !ent ? CEP.status(est.status) : "") + "</div>" + (est && est.priceable && !ent ? CEP.periodToggle("pt-rail") : "");
    if (ctx.length) h += '<div class="sx-ctxrow">' + ctx.map(function (c) { return '<a class="sx-ctx" href="#/explore">' + esc(c) + "</a>"; }).join("") + "</div>";
    if (S.ctx.goals.length) {
      h += '<div class="sx-cv__h">Goals <a class="sx-link" href="#/explore">Edit</a></div><ul class="sx-goals">';
      S.ctx.goals.forEach(function (gid) {
        var g = E.goal(gid); if (!g) return;
        var cv = S.pub.ed ? E.coverGoal(gid, S.pub.ed, S.pub.accepted) : null;
        var icon = !cv ? "" : (cv.status === "full" ? CEP.ic.check : cv.status === "partial" ? CEP.ic.part : CEP.ic.gap);
        h += '<li class="sx-gl">' + icon + '<span class="sx-gl__t"><span class="sx-gl__n">' + esc(g.name) + "</span>" + (cv ? '<span class="sx-gl__s">' + (cv.status === "full" ? "Covered" : cv.status === "partial" ? "Partly covered" : "Not covered") + "</span>" : "") + "</span></li>";
      });
      h += "</ul>";
    }
    if (ent) {
      h += (S.pub.ed ? '<div class="sx-cv__h">Option you’re considering</div><p class="sx-gl__n">' + esc(CEP.viewEd(S.pub.ed).name) + "</p>" : "");
      h += '<div class="sx-cost"><p class="cep-tailored">Tailored pricing<small>For 1,000+ employees, a Salesforce specialist builds your pricing with you, including volume and commitment options.</small></p></div>';
    } else if (est) {
      h += '<div class="sx-cv__h">Your estimate</div><ul class="sx-lines">';
      est.lines.forEach(function (l) { h += '<li class="sx-ln"><span class="sx-ln__t"><span class="sx-ln__n">' + esc(l.label) + "</span>" + (l.qty ? '<span class="sx-ln__s">' + E.num(l.qty) + " " + esc(l.unitLabel || "") + "</span>" : "") + "</span>" + CEP.amt(l) + "</li>"; });
      h += "</ul>";
      h += '<div class="sx-cost"><div class="sx-cost__r"><span>' + (est.partial ? "Known subtotal" : "Estimated total") + '</span><strong>' + (est.priceable ? CEP.p(est.knownAnnual) : "—") + '</strong></div><div class="sx-cost__n">' + (est.priceable ? CEP.billNote(est.edition.billing.indexOf("monthly") >= 0 && CEP.S.pub.billing === "monthly") + (CEP.isMo() ? " · " + E.money(est.knownAnnual) + "/yr" : " · about " + E.money(est.monthly) + "/mo") + ". " : "") + CEP.partialWhy(est) + "Services shown separately.</div></div>";
    } else {
      h += '<p class="sx-cv__empty">Your estimate builds here as you go. Nothing is added until you choose it.</p>';
    }
    h += '<div class="cep-rail-foot"><button class="sx-link" data-act="resetPublic">Start over</button></div></aside>';
    return h;
  };
  CEP.mobileBar = function () {
    var est = CEP.est(); if (!est) return "";
    if (CEP.isEnt()) return '<div class="sx-bar" role="status"><div class="sx-bar__btn"><span class="sx-bar__l"><strong>Running estimate</strong><small>' + esc((est.edition && est.edition.name) || "") + '</small></span><span class="sx-bar__r"><strong>Tailored</strong><small>pricing with Sales</small></span></div></div>';
    return '<div class="sx-bar" role="status"><div class="sx-bar__btn"><span class="sx-bar__l"><strong>Running estimate</strong><small>' + esc(est.edition.name) + (est.partial ? " · partial" : "") + '</small></span><span class="sx-bar__r"><strong>' + (est.priceable ? E.money(CEP.pv(est.knownAnnual)) : "—") + "</strong><small>" + CEP.perLbl() + "</small></span></div></div>";
  };
  CEP.act.resetPublic = function () {
    if (!confirm("Clear your goals and selections and start over?")) return;
    var keep = CEP.S.me && CEP.S.me.signedIn ? CEP.S.pub.saved : [];
    var f = fresh(); CEP.S.ctx = f.ctx; CEP.S.pub = f.pub; CEP.S.pub.saved = keep; CEP.S.trial = f.trial; CEP.S.hand = f.hand; CEP.save();
    CEP.track("context_changed", { reset: true }); location.hash = "#/explore"; CEP.render();
  };

  /* ── layout wrapper ───────────────────────────────────────────── */
  CEP.page = function (inner, opts) {
    opts = opts || {};
    var region = opts.plain ? "" : " region-cloudblue";
    var noChrome = opts.noChrome || opts.narrow || opts.plain;
    var chrome = noChrome ? "" :
      '<div class="est-wizard"><div class="est-wizard__head"><p class="est-wizard__title">Salesforce Pricing</p><p class="est-wizard__sub">' + esc(FX.copy.hubTitle) + "</p></div>";
    var close = noChrome ? "" : "</div>";
    var crumbs = opts.crumbs || "";
    if (opts.rail) {
      return '<div class="sf-blade-region' + region + '"><section class="blade sx-blade"><div class="blade__content">' +
        chrome + crumbs + (opts.top || "") +
        '<div class="sx-grid"><div class="sx-main">' + inner + '</div><div class="sx-side">' + CEP.rail() + "</div></div>" +
        close + "</div></section></div>" + CEP.mobileBar();
    }
    return '<div class="sf-blade-region' + region + '"><section class="blade sx-blade"><div class="blade__content">' +
      chrome + crumbs + (opts.top || "") + '<div class="cep-wrap' + (opts.narrow ? " cep-wrap--narrow" : "") + '">' + inner + "</div>" + close +
      "</div></section></div>";
  };

  /* ── router ───────────────────────────────────────────────────── */
  CEP.route = function () {
    var h = location.hash || "#/";
    var path = h.replace(/^#/, "").split("?")[0] || "/";
    return path;
  };
  var lastPath = null;
  CEP.render = function () {
    CEP.resetTips();
    var path = CEP.route();
    var fn = CEP.routes[path] || CEP.routes["/404"];
    var app = document.getElementById("app");
    var active = document.activeElement, aid = active && active.id, sel = null;
    try { sel = active && active.selectionStart; } catch (e) { sel = null; }
    var out;
    try { out = fn(); } catch (err) {
      if (window.console) console.error(err);
      out = CEP.page('<h1 class="sx-h2">Something went wrong on this screen</h1><p class="sx-sub">Your selections are saved. Go back, or reset from Research controls.</p><a class="sf-cta sf-cta--primary sf-cta--medium" href="#/">Go to pricing</a>', { narrow: true });
    }
    app.innerHTML = out;
    document.body.classList.toggle("sx-has-bar", !!app.querySelector(".sx-bar"));
    // nav state
    document.querySelectorAll("[data-nav]").forEach(function (a) { if (path.indexOf(a.getAttribute("data-nav")) === 0) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    var changed = path !== lastPath;
    lastPath = path;
    if (changed) {
      window.scrollTo(0, 0);
      var h1 = app.querySelector("h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
      if (CEP.onRoute) CEP.onRoute(path);
    } else if (aid) {
      var el = document.getElementById(aid);
      if (el) { el.focus({ preventScroll: true }); try { if (sel !== null && el.setSelectionRange) el.setSelectionRange(sel, sel); } catch (e) { /* */ } }
    }
    if (CEP.afterRender) { var f = CEP.afterRender; CEP.afterRender = null; f(); }
  };
  CEP.go = function (hash) { if (location.hash === hash) CEP.render(); else location.hash = hash; };
  window.addEventListener("hashchange", CEP.render);

  /* ── delegated events ─────────────────────────────────────────── */
  document.addEventListener("click", function (e) {
    var tip = e.target.closest(".cep-tip");
    var open = document.querySelectorAll(".cep-tip.is-open");
    for (var i = 0; i < open.length; i++) if (open[i] !== tip) open[i].classList.remove("is-open");
    if (tip) {
      e.preventDefault();
      tip.classList.toggle("is-open");
      return;
    }
    var el = e.target.closest("[data-act]");
    if (!el) return;
    var name = el.getAttribute("data-act");
    if (CEP.act[name]) { e.preventDefault(); if (el.getAttribute("aria-disabled") === "true" && !el.hasAttribute("data-allow-disabled")) return; CEP.act[name](el, e); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var tips = document.querySelectorAll(".cep-tip.is-open");
    for (var i = 0; i < tips.length; i++) tips[i].classList.remove("is-open");
  });
  function onInput(e) {
    var el = e.target.closest("[data-in]"); if (!el) return;
    var name = el.getAttribute("data-in");
    var live = el.getAttribute("data-live") === "1";
    if (e.type === "input" && !live) return;
    if (CEP.inp[name]) CEP.inp[name](el, e);
  }
  document.addEventListener("input", onInput);
  document.addEventListener("change", onInput);

  CEP.routes["/404"] = function () {
    return CEP.page('<h1 class="sx-h2">We couldn’t find that page</h1><p class="sx-sub">Your selections are saved.</p><a class="sf-cta sf-cta--primary sf-cta--medium" href="#/">Go to pricing</a>', { narrow: true });
  };

  CEP.boot = function () {
    var h = location.hash;
    if (!h || h === "#" || h === "#/") {
      history.replaceState(null, "", (location.pathname || "") + (location.search || "") + "#/explore");
    }
    CEP.render();
  };
})();
