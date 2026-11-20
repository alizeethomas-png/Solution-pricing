/* ══════════════════════════════════════════════════════════════════
   views-expand.js — Entry B: existing customer "Expand my Salesforce" (v3).
   One order page: add seats, top up Flex Credits, or both at once.
     #/account          sign-in, then the order builder
     #/account/seats    same page, scrolled to "Add seats"
     #/account/credits  same page, scrolled to "Top up Flex Credits"
     #/account/review   combined review
     #/account/done     confirmation (cart resets when you leave)
   All account data is SYNTHETIC (fixtures.account).
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var CEP = window.CEP, FX = CEP.FX, E = CEP.E, esc = CEP.esc, S = function () { return CEP.S; };
  var R = CEP.routes, A = CEP.act, I = CEP.inp, AC = FX.account, CR = AC.credits;
  CEP.stepHandlers = CEP.stepHandlers || {};

  function cart() {
    var a = S().acct;
    if (!a.cart) a.cart = newCart();
    return a.cart;
  }
  function newCart() { return { seats: {}, effective: FX.meta.today, packs: 0, packsTouched: false, model: "prepurchase", estimate: "", horizon: "term", calcOpened: false, calcDown: false, step: "edit", order: null, submitting: false, error: false, requestSent: false, ackRate: null, started: {} }; }
  function quote() {
    var s = S(), c = cart();
    return E.cartQuote({ role: s.acct.role, seats: c.seats, effective: c.effective, packs: c.packs, model: c.model,
      estimateAnnual: +String(c.estimate).replace(/[^0-9]/g, "") || null, horizon: c.horizon, failures: s.rs.failures,
      rateOverride: c.ackRate ? { sales_adv: c.ackRate } : null });
  }
  function who() { var a = S().acct; return a.role && AC.users[a.role] ? AC.users[a.role] : null; }
  function needSignin() { var a = S().acct; return !a.signedIn || !who(); }
  function acctBar() {
    var u = who();
    return '<div class="cep-acctbar"><div><span class="sx-tagline">Signed in (simulated)</span><strong>' + esc(AC.name) + ' <span class="cep-syn">synthetic</span></strong><span class="sx-mod__d">' + (u ? esc(u.name) + " · " + esc(u.roleLabel) : "") + " · Contract " + esc(AC.contract) + "</span></div>" +
      '<div class="sx-btnrow"><a class="sx-link" href="#/account">Your order</a><button class="sx-link" data-act="signOut">Sign out</button></div></div>';
  }
  /* "List $395/user/mo · Your rate $375/user/mo" — the negotiated discount is visible (Leah, Nov 16) */
  function rateLine(l, rate) { var r = rate || l.rate; return (l.listRate ? '<span class="cep-list">List ' + CEP.pu(l.listRate, "user/mo") + "</span> · " : "") + '<strong class="cep-yours">Your rate ' + CEP.pu(r, "user/mo") + "</strong>"; }
  /* Proration made visible: the amount due now covers only the days left in the term, not a month. */
  function monthsLeft(l) { return (Math.round(l.remDays / l.termDays * 12 * 10) / 10).toFixed(1); }
  function prorateWhy(l) { return "for the " + l.remDays + " days (about " + monthsLeft(l) + " months) left, at " + E.money(l.rate) + "/user/mo"; }
  function seatWord(n) { return n + (n === 1 ? " seat" : " seats"); }
  function tr(a, b) { return '<tr><th scope="row">' + a + "</th><td>" + b + "</td></tr>"; }

  /* ═════════ SIGN-IN ═════════ */
  function signIn() {
    var a = S().acct, em = a.email || "";
    var h = '<h1 class="sx-vh">Sign in to expand</h1>' + CEP.tbid({ ctx: "customer", mode: "signin", email: em, err: a.signinErr, purpose: "Log in to add seats, top up Flex Credits, or both." });
    return CEP.page('<div class="cep-tb-page">' + h + "</div>", { narrow: true });
  }
  I.lgU = function (el) { S().acct.email = el.value; CEP.save(); };
  A.signIn = function () {
    var s = S(), u = document.getElementById("tb-e"), v = (u && u.value || "").trim();
    s.acct.email = v;
    if (!/.+@.+\..+/.test(v)) { s.acct.signinErr = "Enter the email address you use to log in to Salesforce."; CEP.save(); CEP.render(); var x = document.getElementById("tb-e"); if (x) x.focus(); return; }
    if (s.rs.failures.signinFail) { s.rs.failures.signinFail = false; s.acct.signinErr = "We couldn’t sign you in (simulated). Check your details and try again."; CEP.track("login_state_selected", { role: "failed" }); CEP.save(); CEP.render(); return; }
    s.acct.signinErr = null; s.acct.role = s.rs.signinRole || "buyer"; s.acct.signedIn = true;
    CEP.track("login_state_selected", { role: s.acct.role }); CEP.save(); CEP.render();
  };

  A.signOut = function () { var s = S(); s.acct.signedIn = false; s.acct.role = null; CEP.save(); CEP.go("#/account"); };
  A.refreshAcct = function () { S().rs.failures.stale = false; CEP.save(); CEP.toast("Account data refreshed (simulated)"); CEP.render(); };

  /* ═════════ ORDER BUILDER ═════════ */
  function builder(focus) {
    if (needSignin()) return signIn();
    var s = S(), a = s.acct, c = cart(), f = s.rs.failures;
    if (c.step === "done") { // leaving the confirmation starts a fresh order
      a.lastOrder = c.order ? { id: c.order.id, at: c.order.at } : a.lastOrder;
      a.cart = newCart(); c = a.cart; CEP.save();
    }
    if (c.step === "review") c.step = "edit";
    if (!c.effective || c.effective < FX.meta.today) c.effective = FX.meta.today; // a start date never sits in the past
    var q = quote(), pos = E.creditPosition(f), days = E.daysInclusive(FX.meta.today, AC.termEnd);
    CEP.track("footprint_viewed", { role: a.role });
    var h = acctBar();
    if (a.lastOrder && q.empty) h += CEP.note("ok", "Order " + esc(a.lastOrder.id) + " was placed (simulated). You can start another one below.");
    if (f.stale) h += CEP.note("w", "<strong>Your account data may be out of date</strong> (last synced 3 days ago, simulated). Ordering is paused until you refresh. <button class=\"sx-link\" data-act=\"refreshAcct\">Refresh account data</button>");
    if (a.role === "admin") h += CEP.note("", "<strong>You can prepare this order but not place it.</strong> " + esc(AC.users.buyer.name) + " is the authorized buyer. When you’re ready, send it to them for approval.");
    h += '<div class="cep-row-between"><h1 class="sx-h2">Expand your Salesforce</h1>' + CEP.periodToggle("pt-acct") + "</div>";
    h += '<p class="sx-sub">Add seats, top up Flex Credits, or both in one order. Contract ' + esc(AC.contract) + " runs to " + E.fmtDate(AC.termEnd) + " (" + days + " days left).</p>";

    var main = seatsSection(q) + creditsSection(q, pos);
    var summary = summaryCard(q);
    h += '<div class="sx-grid cep-xgrid"><div class="cep-xmain">' + main + '<div class="cep-mob-only" id="mob-order">' + summary.replace(/id="pt-[^"]*"/g, "") + '</div></div><div class="sx-side">' + summary + "</div></div>";
    var bar = q.empty ? "" : '<div class="sx-bar"><a class="sx-bar__btn" href="#/account" data-act="toMobOrder"><span class="sx-bar__l"><strong>Your order</strong><small>' + (q.seatLines.length ? q.seatLines.reduce(function (t, l) { return t + l.qty; }, 0) + " seats" : "") + (q.seatLines.length && q.packs ? " + " : "") + (q.packs ? E.credits(q.plan.buyCredits) + " credits" : "") + '</small></span><span class="sx-bar__r"><strong>' + E.money(q.dueNow) + "</strong><small>due on next invoice</small></span></a></div>";
    h += '<div class="cep-switch">' + CEP.ic.info + ' <span>Looking for a new product? <a href="#/explore">Explore pricing</a>. Your order here is kept.</span></div>';
    if (focus) CEP.afterRender = function () { var el = document.getElementById(focus); if (el) { if (el.scrollIntoView) el.scrollIntoView({ block: "start" }); var hh = el.querySelector("h2"); if (hh) { hh.setAttribute("tabindex", "-1"); hh.focus({ preventScroll: true }); } } };
    return CEP.page(h, {}) + bar;
  }
  A.toMobOrder = function () { var el = document.getElementById("mob-order"); if (el && el.scrollIntoView) el.scrollIntoView({ block: "start" }); };
  R["/account"] = function () { return builder(null); };
  R["/account/seats"] = function () { return builder("seats"); };
  R["/account/credits"] = function () { return builder("credits"); };

  function seatsSection(q) {
    var c = cart();
    var h = '<section class="sx-cb cep-xsec" id="seats" aria-labelledby="seats-h"><div class="cep-row-between"><h2 class="sx-h3" id="seats-h" style="margin:0">Add seats</h2><span class="sx-tagline">Prorated to ' + E.fmtDate(AC.termEnd) + "</span></div>" +
      '<p class="sx-mod__d">Choose how many users to add to each product. You only pay for the days left in your term.</p><div class="cep-lrows">';
    AC.licenses.forEach(function (l) {
      var qty = c.seats[l.id] || 0, line = q.seatLines.filter(function (x) { return x.lic.id === l.id; })[0];
      h += '<div class="cep-lrow' + (qty > 0 ? " is-on" : "") + '"><div class="cep-lrow__t"><strong>' + esc(l.name) + '</strong><span class="sx-mod__d">' + l.used + " of " + l.qty + " seats in use · " + (l.rate ? rateLine(l) : "Included") + "</span>";
      if (!l.eligible) h += '<span class="cep-lrow__r">' + esc(l.reason) + (l.included ? "" : ' <button class="sx-link" data-act="acctTeam" data-k="seats" data-code="contract">Contact your account team</button>') + "</span>";
      h += '</div><div class="cep-lrow__c">';
      if (l.eligible) {
        h += '<label class="sx-vh" for="sq_' + l.id + '">Seats to add to ' + esc(l.name) + "</label>" + stepperNoLabel("sq_" + l.id, qty, "seats to add");
        h += '<span class="cep-lrow__p">' + (line ? "<strong>" + E.money(line.prorated) + "</strong> due now<small>" + prorateWhy(line) + "</small><small>Then " + CEP.pt(line.annualRun) + " at today’s rate</small>" : "<small>Not adding any</small>") + "</span>";
      } else h += '<span class="sx-chip is-pre">' + (l.included ? "Included" : "Not self-service") + "</span>";
      h += "</div></div>";
    });
    h += "</div>";
    h += '<div class="sx-row cep-eff"><div><label class="sx-lbl" for="seff">Seats start on</label><input id="seff" type="date" min="' + FX.meta.today + '" max="' + AC.termEnd + '" value="' + c.effective + '" data-in="seff" /></div><p class="sx-fine">Prorated from this date to ' + E.fmtDate(AC.termEnd) + ". Renewal pricing is set when you renew.</p></div>";
    h += blockNotes(q.blocks.filter(function (b) { return b.kind === "seats"; }));
    return h + "</section>";
  }
  function stepperNoLabel(id, val, unit) {
    return '<div class="sx-stepper"><button type="button" aria-label="Decrease ' + esc(unit) + '" data-act="step" data-k="' + id + '" data-d="-1">−</button><input id="' + id + '" type="number" min="0" inputmode="numeric" value="' + val + '" data-in="' + id + '" /><button type="button" aria-label="Increase ' + esc(unit) + '" data-act="step" data-k="' + id + '" data-d="1">+</button></div>';
  }
  AC.licenses.forEach(function (l) {
    if (!l.eligible) return;
    CEP.stepHandlers["sq_" + l.id] = function (d) { setSeats(l.id, (cart().seats[l.id] || 0) + d); };
    I["sq_" + l.id] = function (el) { setSeats(l.id, Math.floor(+el.value || 0)); CEP.save(); CEP.render(); };
  });
  function setSeats(lid, v) {
    var c = cart(); v = Math.max(0, v);
    if (v > 0 && !c.started.seats) { c.started.seats = true; CEP.track("expansion_action_selected", { type: "seat" }); }
    if (v) c.seats[lid] = v; else delete c.seats[lid];
    c.requestSent = false; CEP.track("seat_quantity_changed", { lic: lid, qty: v });
  }
  I.seff = function (el) { if (el.value) cart().effective = el.value; CEP.save(); CEP.render(); };

  function creditsSection(q, pos) {
    var c = cart(), p = q.plan;
    CEP.track("credit_balance_viewed", { known: pos.known });
    var h = '<section class="sx-cb cep-xsec" id="credits" aria-labelledby="credits-h"><div class="cep-row-between"><h2 class="sx-h3" id="credits-h" style="margin:0">Top up Flex Credits</h2><span class="sx-tagline">One-time · valid to ' + E.fmtDate(CR.expiry) + "</span></div>";
    if (!pos.known) {
      h += CEP.note("w", "<strong>We can’t load your Digital Wallet balance right now.</strong> Without it we can’t check what you already have, so credit top-ups are paused. You can still add seats. <button class=\"sx-link\" data-act=\"acctTeam\" data-k=\"credits\" data-code=\"nowallet\">Ask your account team</button>");
    } else {
      h += '<div class="cep-meter" role="img" aria-label="' + E.credits(pos.used) + " of " + E.credits(pos.total) + ' credits used this term"><i style="width:' + Math.round(pos.usedPct * 100) + '%"></i></div>';
      h += '<div class="cep-kpis">' + kpi(E.credits(pos.available), "available now") + kpi(E.credits(pos.avgBurn) + "/mo", "average use, last 3 months") + kpi(E.fmtDate(pos.runout), "estimated run-out") + kpi(E.credits(pos.shortfall), "short before " + E.fmtDate(AC.termEnd)) + "</div>";
      h += '<details class="sx-det"><summary>How we counted your credits</summary><ul><li>This term: ' + E.credits(pos.included) + " included + " + E.credits(pos.purchased) + " pre-purchased = " + E.credits(pos.total) + ".</li><li>" + esc(CR.includedNote) + "</li><li>Used " + E.credits(pos.used) + " through " + E.fmtDate(CR.usedThrough) + ". Monthly: " + CR.burn.map(function (b) { return b.m + " " + E.credits(b.v); }).join(", ") + ".</li></ul></details>";
    }
    // how many
    h += '<h3 class="sx-h4">How many credits do you need?</h3>';
    var sugg = p.suggestedPacks;
    h += '<div class="cep-picks" role="group" aria-label="Choose an amount">';
    if (pos.known && sugg > 0) h += pick(sugg, p.needSource === "estimate" ? "Suggested · from your calculator estimate" : "Suggested · covers your forecast", true);
    [1, 3, 5, 10].forEach(function (n) { if (n !== sugg) h += pick(n, ""); });
    if (c.packs) h += '<button class="cep-pick cep-pick--clear" data-act="crPacks" data-n="0">Remove credits</button>';
    h += "</div>";
    h += '<div class="sx-row cep-packrow"><div><label class="sx-lbl" for="packs">Or set packs of 100K</label>' + CEP.stepper("packs", c.packs, "packs") + "</div>" +
      '<p class="sx-fine">' + "List " + E.money(CR.listPackPrice) + " · Your rate " + E.money(CR.packPrice) + " per 100K pack ($0.005 per credit; synthetic contract rate, same as list). Unused credits expire on " + E.fmtDate(CR.expiry) + ".</p></div>";
    // optional calculator
    h += '<details class="sx-det cep-calc-det"' + (c.calcOpened ? " open" : "") + '><summary>Not sure how many credits you need?</summary><div class="cep-calc-cta"><p>Estimate with <a href="' + FX.links.flexCalculator + '" target="_blank" rel="noopener noreferrer" data-act="openCalc" data-allow-disabled>Flex Credit Pricing Calculator ' + CEP.ic.ext + '</a></p><p class="sx-fine">Opens salesforce.com in a new tab. It’s a public planning tool: it can’t see your balance or contract, and nothing comes back automatically. This page keeps your order.</p></div>';
    if (c.calcOpened) {
      h += '<div class="cep-return"><label class="sx-lbl" for="crest">Calculator’s annual estimate (credits per year)</label><div class="sx-row"><input id="crest" type="text" inputmode="numeric" value="' + esc(c.estimate) + '" data-in="crest" placeholder="e.g. 2,000,000" /><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="applyEst">Use this estimate</button></div>' +
        '<p class="sx-fine"><button class="sx-link" data-act="skipEst">I didn’t get an estimate</button> · <button class="sx-link" data-act="calcDown">The calculator didn’t load</button></p>' + (c.calcDown ? '<p class="sx-fine">No problem. We’ll use your recent usage instead.</p>' : "") + "</div>";
      if (pos.known && p.est) h += '<table class="sx-tbl cep-recon"><caption class="sx-vh">How the estimate compares with your balance</caption><tbody>' + tr("Calculator estimate", E.credits(p.est) + "/yr") + tr("Scaled to the " + pos.remMonths.toFixed(1) + " months left", E.credits(p.need)) + tr("Already available", "− " + E.credits(pos.available)) + '<tr class="is-total"><th scope="row">Still needed</th><td>' + E.credits(p.unmet) + (p.unmet > 0 ? " → " + p.suggestedPacks + " packs" : "") + "</td></tr></tbody></table>";
    }
    h += "</details>";
    h += '<details class="sx-det"><summary>Buying model: ' + esc(byId(FX.buyingModels, c.model).name) + '</summary><div class="sx-bill">' + FX.buyingModels.map(function (b) {
      var ok = CR.models[b.id] === true;
      return '<button class="sx-bm' + (c.model === b.id ? " is-on" : "") + (ok ? "" : " is-off") + '" data-act="crModel" data-id="' + b.id + '" aria-pressed="' + (c.model === b.id) + '"' + (ok ? "" : ' aria-disabled="true" data-allow-disabled') + "><strong>" + esc(b.name) + "</strong>" + esc(b.desc) + (ok ? "" : "<em>" + esc(CR.models[b.id]) + "</em>") + "</button>";
    }).join("") + "</div></details>";
    if (c.packs > 0) q.warns.forEach(function (w) { h += CEP.note("w", esc(w)); });
    h += blockNotes(q.blocks.filter(function (b) { return b.kind === "credits"; }));
    return h + "</section>";
  }
  function byId(l, id) { return l.filter(function (x) { return x.id === id; })[0] || l[0]; }
  function kpi(v, l) { return '<div class="cep-kpi"><strong>' + esc(v) + "</strong><span>" + esc(l) + "</span></div>"; }
  function pick(n, tag, primary) {
    var on = cart().packs === n;
    return '<button class="cep-pick' + (on ? " is-on" : "") + (primary ? " is-sugg" : "") + '" data-act="crPacks" data-n="' + n + '" aria-pressed="' + on + '"><strong>' + E.credits(n * CR.packCredits) + "</strong><span>" + E.money(n * CR.packPrice) + "</span>" + (tag ? "<em>" + esc(tag) + "</em>" : "") + "</button>";
  }
  function setPacks(n, how) {
    var c = cart(); n = Math.max(0, n);
    if (n > 0 && !c.started.credits) { c.started.credits = true; CEP.track("expansion_action_selected", { type: "credit" }); }
    c.packs = n; c.packsTouched = true; c.requestSent = false; CEP.track("topup_pack_selected", { packs: n, how: how });
  }
  CEP.stepHandlers.packs = function (d) { setPacks((cart().packs || 0) + d, "stepper"); };
  I.packs = function (el) { setPacks(Math.floor(+el.value || 0), "typed"); CEP.save(); CEP.render(); };
  A.crPacks = function (el) { setPacks(+el.getAttribute("data-n"), "pick"); CEP.save(); CEP.render(); };
  A.openCalc = function (el) {
    cart().calcOpened = true; CEP.track("flex_credit_calculator_clicked", {}); CEP.save();
    try { window.open(el.getAttribute("href"), "_blank", "noopener,noreferrer"); } catch (e) { /* */ }
    CEP.render();
  };
  I.crest = function (el) { cart().estimate = el.value; CEP.save(); };
  A.applyEst = function () { var el = document.getElementById("crest"); if (el) cart().estimate = el.value; var n = +String(cart().estimate).replace(/[^0-9]/g, ""); if (!n) { CEP.toast("Enter a number of credits, or skip"); return; } CEP.track("credit_estimate_entered", { value: n }); CEP.save(); CEP.render(); };
  A.skipEst = function () { cart().estimate = ""; CEP.track("credit_estimate_entered", { skipped: true }); CEP.save(); CEP.render(); };
  A.calcDown = function () { cart().calcDown = true; CEP.track("credit_estimate_entered", { calculator: "unavailable" }); CEP.save(); CEP.render(); };
  A.crModel = function (el) {
    var id = el.getAttribute("data-id"), r = CR.models[id];
    if (r !== true) { CEP.modal("Not available on your contract", "<p>" + esc(r) + "</p><p class=\"sx-sub\">Pre-purchase is available for self-service. No discount is implied by any model.</p><button class=\"sf-cta sf-cta--primary sf-cta--medium\" data-act=\"closeModal\">OK</button>"); return; }
    cart().model = id; CEP.save(); CEP.render();
  };

  /* ── blocks ─────────────────────────────────────────────────── */
  var TITLES = { unauthorized: "You can’t place this order.", contract: "This product can’t be changed here.", cap: "Over the self-service limit.", date: "Check the start date.", stale: "Account data out of date.", nowallet: "Balance unavailable.", type: "Incompatible credit type.", commit: "Commit drawdown rules unknown.", currency: "Currency mismatch.", horizon: "Beyond your current term.", model: "Buying model not available." };
  function blockNotes(blocks) {
    return blocks.map(function (b) {
      var route = b.code === "stale" ? '<button class="sx-link" data-act="refreshAcct">Refresh account data</button>' :
        (["date", "model"].indexOf(b.code) < 0 ? '<button class="sx-link" data-act="acctTeam" data-k="' + b.kind + '" data-code="' + b.code + '">Contact your account team</button>' : "");
      return CEP.note("e", "<strong>" + (TITLES[b.code] || "Blocked.") + "</strong> " + (b.item && b.kind === "seats" ? esc(b.item) + ": " : "") + esc(b.msg) + (b.alt ? " Alternative: " + esc(b.alt) + "." : "") + (route ? "<div>" + route + "</div>" : ""));
    }).join("");
  }
  A.acctTeam = function (el) {
    var k = el.getAttribute("data-k"), code = el.getAttribute("data-code");
    CEP.track("order_blocked_mock", { kind: k, reason: code, routed: "account_team" });
    CEP.modal("Contact your account team", "<p>We’d send your account team this request with your order attached (simulated — nothing is sent):</p><ul class=\"cep-kv\"><li><span>Account</span>" + esc(AC.name) + " (synthetic)</li><li><span>Request</span>" + (k === "seats" ? "Add seats" : k === "credits" ? "Flex Credit top-up" : "Seats and credits") + "</li><li><span>Reason</span>" + esc(TITLES[code] || "Help with an order") + "</li></ul><p class=\"sx-sub\">Your order stays on this page.</p><button class=\"sf-cta sf-cta--primary sf-cta--medium\" data-act=\"closeModal\">Done</button>");
  };

  /* ── summary ─────────────────────────────────────────────────── */
  function summaryCard(q) {
    var s = S(), c = cart();
    var h = '<aside class="sx-cv cep-order" aria-label="Your order"><div class="sx-cv__head"><h2 class="sx-cv__title">Your order</h2>' + (q.empty ? "" : (q.ok ? '<span class="sx-chip is-est">Ready to review</span>' : '<span class="sx-chip is-sub">Needs attention</span>')) + "</div>";
    if (q.empty) h += '<p class="sx-cv__empty">Nothing added yet. Add seats, Flex Credits, or both.</p><div class="sx-btnrow"><a class="sx-link" href="#/account/seats">Add seats</a><a class="sx-link" href="#/account/credits">Add credits</a></div>';
    else {
      h += '<ul class="sx-lines">';
      q.seatLines.forEach(function (l) { h += '<li class="sx-ln"><span class="sx-ln__t"><span class="sx-ln__n">' + esc(l.lic.name) + '</span><span class="sx-ln__s">+' + seatWord(l.qty) + " from " + E.fmtDate(l.effective) + " · " + prorateWhy(l) + '</span></span><span class="sx-amt">' + E.money(l.prorated) + "</span></li>"; });
      if (q.packs) h += '<li class="sx-ln"><span class="sx-ln__t"><span class="sx-ln__n">Flex Credits</span><span class="sx-ln__s">' + E.credits(q.plan.buyCredits) + " (" + q.packs + " × 100K)</span></span><span class=\"sx-amt\">" + E.money(q.creditsDue) + "</span></li>";
      h += "</ul>";
      h += '<div class="sx-cost"><div class="sx-cost__r"><span>Due on your next invoice</span><strong>' + E.money(q.dueNow) + '</strong></div><div class="sx-cost__n">One-time charges' + (q.seatLines.length ? ": seats prorated for the " + q.seatLines[0].remDays + " days (about " + monthsLeft(q.seatLines[0]) + " months) left in your term" : "") + (q.packs ? (q.seatLines.length ? ", plus credit packs" : ": credit packs") : "") + '. Excludes taxes.</div>' +
        (q.ongoingAnnual ? '<div class="sx-cost__r sx-cost__r--s" style="margin-top:8px"><span>Added ongoing cost at today’s rate</span><strong>' + CEP.p(q.ongoingAnnual) + "</strong></div>" : "") + "</div>";
      var n = q.blocks.length;
      if (n) h += '<p class="sx-gl__w" role="status">' + (q.blocks[0].code === "unauthorized" ? "Needs approval from " + esc(AC.users.buyer.name) + "." : "Fix " + n + " issue" + (n > 1 ? "s" : "") + " in your order to continue.") + "</p>";
      if (s.acct.role === "admin") {
        h += c.requestSent ? '<p class="cep-ok-inline">Sent to ' + esc(AC.users.buyer.name) + " for approval (simulated). Your order stays here.</p>" :
          '<button class="sf-cta sf-cta--primary sf-cta--medium cep-full" data-act="requestApproval">Send to ' + esc(AC.users.buyer.name) + " for approval</button>";
      } else h += '<button class="sf-cta sf-cta--primary sf-cta--medium cep-full" data-act="review"' + (q.ok ? "" : ' aria-disabled="true"') + ">Review order</button>";
    }
    CEP.track("topup_eligibility_checked", { ok: q.ok, blocks: q.blocks.map(function (b) { return b.code; }) });
    return h + "</aside>";
  }
  A.requestApproval = function () { cart().requestSent = true; CEP.track("order_blocked_mock", { kind: "combined", reason: "unauthorized", routed: "approval" }); CEP.save(); CEP.render(); };
  A.review = function () { cart().step = "review"; cart().error = false; CEP.track("order_reviewed_mock", { seats: Object.keys(cart().seats).length, packs: cart().packs }); CEP.save(); CEP.go("#/account/review"); };

  /* ═════════ REVIEW ═════════ */
  R["/account/review"] = function () {
    if (needSignin()) return signIn();
    var s = S(), c = cart(), f = s.rs.failures, q = quote();
    if (c.step === "done" && c.order) return R["/account/done"]();
    if (!q.ok) { c.step = "edit"; CEP.afterRender = function () { location.hash = "#/account"; }; return builder(null); }
    var changed = f.priceChanged && !c.ackRate && q.seatLines.some(function (l) { return l.lic.id === "sales_adv"; });
    var h = acctBar() + CEP.crumbs([["Build order", "#/account"], ["Review", null], ["Confirmation", null]], 1) + '<h1 class="sx-h2">Review your order</h1>';
    if (changed) { var base = AC.licenses[0].rate; h += CEP.note("w", "<strong>A price changed since you started.</strong> Sales Cloud Advanced is now " + CEP.pu(base + 10, "user/mo") + " (was " + CEP.pu(base, "user/mo") + ", synthetic). Check the new total before you place the order. <div><button class=\"sf-cta sf-cta--secondary sf-cta--medium\" data-act=\"ackRate\">Use the new price</button></div>"); }
    h += '<div class="sx-tblw"><table class="sx-tbl sx-tbl--est"><caption class="sx-vh">Order lines</caption><thead><tr><th scope="col">Item</th><th scope="col">Details</th><th scope="col">Due now</th></tr></thead><tbody>';
    q.seatLines.forEach(function (l) {
      h += '<tr><th scope="row">' + esc(l.lic.name) + "<small>+" + seatWord(l.qty) + " (" + l.lic.qty + " → " + l.newTotal + ")</small></th><td>" + rateLine(l.lic, l.rate) + ", from " + E.fmtDate(l.effective) + "<small>" + l.qty + " × " + E.money(l.rate) + "/mo × 12 × " + l.remDays + "/" + l.termDays + " days. Ongoing at today’s rate: " + CEP.pt(l.annualRun) + ". Renewal pricing is set when you renew.</small></td><td>" + E.money(l.prorated) + "</td></tr>";
    });
    if (q.packs) h += '<tr><th scope="row">Flex Credits<small>' + E.credits(q.plan.buyCredits) + " (" + q.packs + " × 100K)</small></th><td>Pre-purchase, valid to " + E.fmtDate(CR.expiry) + "<small>Balance after top-up: " + E.credits(q.plan.newAvailable) + "</small></td><td>" + E.money(q.creditsDue) + "</td></tr>";
    h += '<tr class="is-total"><th scope="row">Due on your next invoice</th><td>One-time · excludes taxes</td><td>' + E.money(q.dueNow) + "</td></tr></tbody></table></div>";
    if (q.ongoingAnnual) h += '<p class="sx-fine">Added ongoing cost at today’s rate: ' + CEP.pt(q.ongoingAnnual) + (CEP.isMo() ? " (" + E.money(q.ongoingAnnual) + "/yr)" : "") + ".</p>";
    q.warns.forEach(function (w) { h += CEP.note("w", esc(w)); });
    h += '<p class="sx-fine">Added to your existing invoice (simulated). No card details are collected. Your calculator estimate is not an order; only the amounts above would be bought.</p>';
    if (c.error) h += CEP.note("e", "<strong>The order didn’t go through.</strong> Nothing was placed and you weren’t charged. Your order is kept. <button class=\"sx-link\" data-act=\"place\">Try again</button> · <button class=\"sx-link\" data-act=\"acctTeam\" data-k=\"all\" data-code=\"fail\">Get help</button>");
    h += '<div class="sx-foot"><a class="sf-cta sf-cta--secondary sf-cta--medium" href="#/account">← Back</a><span class="sx-foot__n"></span><button class="sf-cta sf-cta--primary sf-cta--medium" data-act="place"' + (changed || c.submitting ? ' aria-disabled="true"' : "") + ">" + (c.submitting ? "Placing order…" : "Place order (simulated)") + "</button></div>";
    return CEP.page(h, {});
  };
  A.ackRate = function () { cart().ackRate = AC.licenses[0].rate + 10; CEP.track("price_assumptions_changed", { kind: "seats", rateChanged: true }); CEP.save(); CEP.render(); };
  A.place = function () {
    var s = S(), c = cart(), f = s.rs.failures;
    if (c.submitting || c.order) { CEP.track("order_blocked_mock", { kind: "combined", reason: "duplicate_submit" }); CEP.toast("Already submitted — no duplicate order created"); return; }
    c.submitting = true; c.error = false; CEP.save(); CEP.render();
    setTimeout(function () {
      c.submitting = false;
      if (f.orderFail) { f.orderFail = false; c.error = true; CEP.track("order_blocked_mock", { kind: "combined", reason: "order_failed" }); CEP.save(); CEP.render(); return; }
      var q = quote(), lines = [];
      q.seatLines.forEach(function (l) { lines.push([l.lic.name, "+" + seatWord(l.qty) + " from " + E.fmtDate(l.effective) + " · " + prorateWhy(l), E.money(l.prorated)]); });
      if (q.packs) lines.push(["Flex Credits", E.credits(q.plan.buyCredits) + ", valid to " + E.fmtDate(CR.expiry), E.money(q.creditsDue)]);
      c.order = { id: "SIM-" + Math.floor(100000 + Math.random() * 899999), at: new Date().toISOString(), lines: lines, due: q.dueNow, ongoing: q.ongoingAnnual, prov: "pending", newBalance: q.packs ? q.plan.newAvailable : null };
      c.step = "done"; s.acct.orders.push({ id: c.order.id });
      CEP.track("order_confirmed_mock", { kind: "combined", id: c.order.id, seats: q.seatLines.length, packs: q.packs });
      CEP.save(); CEP.go("#/account/done");
    }, 700);
  };

  /* ═════════ CONFIRMATION ═════════ */
  R["/account/done"] = function () {
    if (needSignin()) return signIn();
    var c = cart(), o = c.order;
    if (!o) return builder(null);
    var h = acctBar() + '<div class="cep-confirm"><p class="cep-proto-tag">SIMULATED ORDER — NOTHING WAS CHARGED OR PROVISIONED</p><h1 class="sx-h2">Order placed</h1><p class="sx-sub">Order ' + esc(o.id) + " · " + new Date(o.at).toLocaleString() + "</p>";
    h += '<div class="sx-tblw"><table class="sx-tbl"><tbody>' + o.lines.map(function (l) { return '<tr><th scope="row">' + esc(l[0]) + "<small>" + esc(l[1]) + "</small></th><td>" + esc(l[2]) + "</td></tr>"; }).join("") + '<tr class="is-total"><th scope="row">Due on your next invoice</th><td>' + E.money(o.due) + "</td></tr></tbody></table></div>";
    if (o.ongoing) h += '<p class="sx-fine">Added ongoing cost at today’s rate: ' + CEP.pt(o.ongoing) + ".</p>";
    h += '<div class="cep-prov"><span class="sx-tagline">Activation status</span>' + (o.prov === "pending" ? '<p><span class="sx-chip is-sub">Pending</span> New seats usually appear in Setup and credits in Digital Wallet within a few minutes (simulated). <button class="sx-link" data-act="provRefresh">Refresh status</button></p>' : '<p><span class="sx-chip is-est">Active</span> Seats are ready to assign' + (o.newBalance !== null ? " and your balance is now " + E.credits(o.newBalance) : "") + " (simulated).</p>") + "</div>";
    h += '<div class="sx-btnrow sx-mt"><a class="sf-cta sf-cta--primary sf-cta--medium" href="#/account">Start a new order</a><a class="sf-cta sf-cta--secondary sf-cta--medium" href="#/">Back to pricing</a></div></div>';
    return CEP.page(h, {});
  };
  A.provRefresh = function () { var o = cart().order; if (o) o.prov = "active"; CEP.save(); CEP.render(); };
})();
