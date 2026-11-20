/* ══════════════════════════════════════════════════════════════════
   views-public.js — Entry A: public pricing hub and flows F1–F4, F8.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var CEP = window.CEP, FX = CEP.FX, E = CEP.E, esc = CEP.esc, S = function () { return CEP.S; };
  var R = CEP.routes, A = CEP.act, I = CEP.inp;
  var STEPS = [["About you", "#/explore"], ["Options", "#/recommend"], ["Customize", "#/estimate"], ["Next steps", "#/next"]];

  var ROW_TIPS = {
    Price: "List price per user per month. The total below is for the number of users you entered, before taxes and add-ons.",
    Billing: "Whether you can pay month to month, or only on an annual contract.",
    "Flex Credits included": "Credits that come with the edition each year for AI and Data 360 usage. Changing edition does not stack unused credits.",
    Included: "Capabilities that come with this edition. They are not charged again as add-ons.",
    "Not included": "Limits of this edition, and things you would add separately or get by choosing a higher edition.",
    Try: "A free trial for this edition, if one is offered.",
    "Try first": "A free trial for this edition, if one is offered.",
    Slack: "The Slack plan that comes with this edition.",
    Limitations: "Limits of this edition, and things you would add separately or get by choosing a higher edition.",
    "Goals covered": "How many of your selected goals this edition covers on its own, before any add-ons."
  };
  var FEATURE_TIPS = {
    "Lead, account and opportunity management": "Track people, companies and deals in one CRM.",
    "Basic case management": "Log and close simple customer support cases.",
    "Email marketing": "Send email campaigns from the same CRM.",
    "Slack Free": "Team chat with Slack’s free plan.",
    "Everything in Starter": "Includes the Starter Suite capabilities, then adds more.",
    "Forecasting and quoting": "See expected revenue and send quotes from the CRM.",
    "Workflow automation": "Set rules so routine steps run without extra clicks.",
    "Service with knowledge base": "Support cases plus a library of answers for your team.",
    "Full Sales Cloud CRM": "Complete sales tools: pipeline, forecasting, quoting and more.",
    "500K Flex Credits per org/year": "500,000 Flex Credits per org each year for agent actions and Data 360. Same Core allowance on Sales, Service and Sales & Service.",
    "Slack Business+": "Paid Slack with more security and admin controls than Slack Free. Included in Core and Advanced.",
    "Tableau Next (Consumer + one Creator per org)": "Tableau Next is in every Core and Advanced edition: Consumer for the org, plus one Creator.",
    "Tableau Next (in Agentforce 1 Edition)": "Tableau Next ships inside Agentforce 1 Edition on Max.",
    "Data Cloud provisioning": "Turns Data Cloud / Data 360 on for the org. Extra profiles are a separate add-on.",
    "Premier Success": "A higher support tier. On the Core BOM only.",
    "Sales Cloud Unlimited CRM": "The Unlimited-tier Sales Cloud SKU that Advanced is built on.",
    "Service Cloud Unlimited CRM": "The Unlimited-tier Service Cloud SKU that Advanced is built on.",
    "1M Flex Credits per org/year": "One million Flex Credits per org each year for AI and Data 360 usage.",
    "Security suite": "Security Center, Data Detect, and backup/archive capacity on the Advanced and Max BOMs.",
    "Enablement, Sales Insights and Account Research": "Sales Advanced BOM items on top of Core.",
    "Customer Signals Intelligence and Help Agent Access": "Service Advanced BOM items on top of Core.",
    "Agentforce 1 Sales Edition": "The Max base SKU for Sales. Includes Slack Enterprise+ and Agentforce.",
    "Agentforce 1 Service Edition": "The Max base SKU for Service. Includes Slack Enterprise+ and Agentforce.",
    "Agentforce 1 Sales and Service": "Max combined BOM: Agentforce 1 Sales plus Agentforce 1 Service.",
    "Agentforce for employees included": "Unmetered AI agents for your own employees, at no extra per-user add-on price. Included in every Max edition.",
    "2.75M Flex Credits per org/year": "2.75 million Flex Credits per org each year for AI and Data 360 usage.",
    "Slack Enterprise+": "Slack’s highest plan. Comes with Agentforce 1 Edition on Max.",
    "Agentforce Contact Center Digital": "Digital contact-center agents on the Max BOM.",
    "Agentforce Contact Center": "Workforce Management and Digital contact-center items on the Service Max BOM.",
    "Full Service Cloud CRM": "Complete service tools: cases, routing, knowledge and more.",
    "Sales and Service Cloud CRM": "Both Sales and Service on one combined Core SKU.",
    "Sales and Service Unlimited CRM": "Both Sales and Service on one combined Advanced SKU.",
    "Sales enablement plus Help Agent Access": "Enablement, insights and Help Agent Access from the combined Advanced BOM.",
    "No forecasting or quoting": "You cannot build a sales forecast or send quotes on this edition.",
    "No built-in AI agents": "This edition does not include Agentforce. Choose a higher edition or an add-on.",
    "No Data 360": "Unified customer profiles are not available on this edition.",
    "Annual contract required": "You cannot pay month to month on this edition.",
    "Covers one function (sales)": "This edition is for sales teams. Service, marketing and other clouds are add-ons.",
    "Covers one function (service)": "This edition is for service teams. Sales and other clouds are add-ons.",
    "Unmetered employee Agentforce is an add-on": "Built-in AI and included credits are here. Unlimited employee agents cost extra except on Max.",
    "Pay as you go and Pre-commit buying models aren’t available": "Usage on this edition is bought up front, not billed monthly in arrears.",
    "Priced for teams that want the full platform": "Max is the all-in edition. Most teams start on Core or Advanced.",
    "Viewers and Explorers sold separately": "People who only view or explore dashboards need a different Tableau license.",
    "Not a CRM edition": "Tableau does not include sales or service CRM. Pair it with a CRM edition if you need both.",
    "No included Flex Credits": "This edition does not come with Flex Credits for Agentforce or Data 360."
  };
  function featLine(t) {
    var tip = FEATURE_TIPS[t] || "What this edition includes or leaves out.";
    return '<span class="cep-feat">' + esc(t) + CEP.infoTip(t, tip) + "</span>";
  }

  function prodIcon(n) { return '<img class="sx-gico" src="assets/product-icons/' + n + '.svg" alt="" width="28" height="28" />'; }
  /* Neutral outcome glyphs — deliberately NOT Salesforce product icons, so
     the goal step describes outcomes without steering to products. */
  function gsv(d) { return '<svg class="cep-gglyph" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>"; }
  var GOAL_GLYPH = {
    g_sales: gsv('<path d="M3 17l5-5 4 4 8-8"/><path d="M15 8h5v5"/>'),
    g_service: gsv('<path d="M4 5h16v10H9l-4 4v-4H4z"/><path d="M8.5 10.5l2 2 4-4"/>'),
    g_ai: gsv('<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>'),
    g_data: gsv('<circle cx="12" cy="9" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
    g_market: gsv('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8"/>'),
    g_integrate: gsv('<path d="M10 14a4 4 0 0 1 0-5.6l2.4-2.4a4 4 0 0 1 5.6 5.6L16.5 13"/><path d="M14 10a4 4 0 0 1 0 5.6l-2.4 2.4a4 4 0 0 1-5.6-5.6L7.5 11"/>'),
    g_commerce: gsv('<path d="M5 8h14l-1.2 11H6.2z"/><path d="M9 8a3 3 0 0 1 6 0"/>')
  };

  /* ═════════ HOME: one screen, switch + 3 steps + action ═════════ */
  var HOW = {
    "new": { label: "I’m new to Salesforce", steps: [
      ["Tell us about your business", "Region, company size, industry and goals"],
      ["Compare your options", "See what each one covers and costs per month"],
      ["Try it free or talk to us", "Start a 30-day trial or get help from a specialist"]] },
    existing: { label: "I’m already a customer", steps: [
      ["Sign in", "Use your Salesforce login. No questionnaire."],
      ["See what you have", "Your seats, contract dates and Flex Credit balance"],
      ["Add seats or top up credits", "See the exact cost before you order"]] }
  };
  R["/"] = function () {
    var s = S(), guided = s.variant === "guided", cur = (s.view && s.view.audience) || "new", d = HOW[cur];
    var h = '<div class="sf-blade-region region-cloudblue"><section class="blade cep-home"><div class="blade__content"><div class="cep-home__in">' +
      '<h1 class="sx-h1 cep-home__h">Salesforce Pricing</h1><h2 class="sx-h3 cep-home__h2">' + esc(FX.copy.hubTitle) + '</h2><p class="sx-lead cep-home__lead">' + esc(FX.copy.hubLead) + "</p>" +
      '<p class="cep-expect">' + CEP.ic.info + " <span>" + esc(FX.copy.expect) + "</span></p>" +
      '<div class="cep-aud cep-aud--home" role="tablist" aria-label="Choose your situation">' + ["new", "existing"].map(function (k) {
        var on = k === cur;
        return '<button type="button" role="tab" id="aud-' + k + '" aria-selected="' + on + '" aria-controls="aud-panel" tabindex="' + (on ? "0" : "-1") + '" class="cep-aud__b' + (on ? " is-on" : "") + '" data-act="audience" data-v="' + k + '">' + esc(HOW[k].label) + "</button>";
      }).join("") + "</div>" +
      '<div id="aud-panel" role="tabpanel" aria-labelledby="aud-' + cur + '"><ol class="cep-steps3">' + d.steps.map(function (st, i) {
        return '<li><span class="cep-steps3__n" aria-hidden="true">' + (i + 1) + '</span><span class="cep-steps3__t"><strong>' + esc(st[0]) + "</strong><span>" + esc(st[1]) + "</span></span></li>";
      }).join("") + "</ol>";
    if (cur === "existing") h += '<div class="cep-home__cta"><a class="sf-cta sf-cta--primary sf-cta--hero" href="#/account" data-act="entry" data-entry="B" data-allow-disabled>Sign in</a></div>';
    else if (guided) h += '<div class="cep-home__cta"><a class="sf-cta sf-cta--primary sf-cta--hero" href="#/start" data-act="entry" data-entry="guided" data-allow-disabled>Find my plan</a><a class="sx-link cep-home__alt" href="#/editions" data-act="entry" data-entry="editions" data-allow-disabled>Know what you want? Compare packaged editions →</a></div>';
    else h += '<div class="cep-home__cta"><a class="sf-cta sf-cta--primary sf-cta--hero" href="#/editions" data-act="entry" data-entry="editions" data-allow-disabled>Compare packaged editions</a><a class="sx-link cep-home__alt" href="#/start" data-act="entry" data-entry="guided" data-allow-disabled>Not sure? Find my plan →</a></div>';
    h += "</div></div></div></section></div>";
    return h;
  };
  A.audience = function (el) {
    var v = el.getAttribute("data-v"); S().view = S().view || {}; S().view.audience = v;
    CEP.track("context_changed", { audience: v }); CEP.save(); CEP.render();
    var t = document.getElementById("aud-" + v); if (t) t.focus();
  };
  document.addEventListener("keydown", function (e) {
    var t = e.target.closest && e.target.closest(".cep-aud__b"); if (!t) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); A.audience({ getAttribute: function () { return t.getAttribute("data-v") === "new" ? "existing" : "new"; } }); }
  });
  A.entry = function (el) { CEP.track("pricing_entry", { entry: el.getAttribute("data-entry") }); location.hash = el.getAttribute("href"); };

  /* ═════════ FIND MY PLAN entry: resume screen when there is progress ═════════ */
  function hasProgress() { var s = S(); return s.ctx.goals.length > 0 || !!s.pub.ed; }
  R["/start"] = function () {
    var s = S();
    if (!hasProgress()) { CEP.afterRender = function () { location.replace(location.href.split("#")[0] + "#/explore"); }; return R["/explore"](); }
    var est = CEP.est(), ed = s.pub.ed ? E.ed(s.pub.ed) : null;
    var h = '<div class="cep-resume"><h1 class="sx-h2">Pick up where you left off</h1><p class="sx-sub">We saved your answers on this device.</p><ul class="cep-kv">' +
      '<li><span>Goals</span>' + (s.ctx.goals.map(function (g) { return esc(E.goal(g).name); }).join(", ") || "None yet") + "</li>" +
      (ed ? "<li><span>Option</span>" + esc(ed.name) + " · " + E.num(CEP.sel().seats) + " users (seats)</li>" : "") +
      (est ? "<li><span>Estimate</span>" + (CEP.isEnt() ? "Tailored pricing with Sales" : est.priceable ? CEP.pt(est.knownAnnual) + (est.partial ? " (partial)" : "") : "Not priced for your region") + "</li>" : "") + "</ul>" +
      '<div class="sx-btnrow sx-mt"><a class="sf-cta sf-cta--primary sf-cta--medium" href="' + esc(s.pub.lastRoute || "#/explore") + '" data-act="resumeGo" data-allow-disabled>Continue where I left off</a><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="resumeNew">Start a new plan</button></div></div>';
    CEP.track("pricing_entry", { entry: "resume_offered" });
    return CEP.page(h, { narrow: true });
  };
  A.resumeGo = function (el) { CEP.track("pricing_entry", { entry: "resumed" }); location.hash = el.getAttribute("href"); };
  A.resumeNew = function () {
    var s = S(), saved = s.pub.saved, ctx0 = JSON.parse(JSON.stringify(s.ctx));
    s.ctx = { industry: null, size: null, region: "na", goals: [], freeText: "", suggested: [], skipped: false };
    var p = s.pub; p.ed = null; p.edPicked = false; p.seats = null; p.accepted = {}; p.declined = {}; p.actions = 0; p.lastRoute = "#/explore"; p.origin = null; p.saved = saved;
    s.trial = { state: null, tasks: [], kind: null };
    CEP.track("context_changed", { reset: true, from: ctx0.goals }); CEP.save(); CEP.go("#/explore");
  };

  /* ═════════ STEP 1 · ABOUT YOU ═════════ */
  function stepNav(back, backLbl, next, nextLbl, opts) {
    opts = opts || {};
    return '<div class="cep-stepnav"><a class="sf-cta-back" href="' + back + '">' + esc(backLbl || "Back") + "</a>" +
      (opts.hint ? '<span class="cep-stepnav__hint" role="status">' + opts.hint + "</span>" : '<span class="cep-stepnav__hint"></span>') +
      (next ? (opts.act ? '<button class="sf-cta sf-cta--primary sf-cta--medium" data-act="' + opts.act + '"' + (opts.disabled ? ' aria-disabled="true"' : "") + ">" + esc(nextLbl) + "</button>" : '<a class="sf-cta sf-cta--primary sf-cta--medium" href="' + next + '">' + esc(nextLbl) + "</a>") : "") + "</div>";
  }
  CEP.stepNav = stepNav;
  R["/explore"] = function () {
    var s = S(), c = s.ctx;
    s.pub.lastRoute = "#/explore";
    var ind = c.industry && FX.industries.filter(function (i) { return i.id === c.industry; })[0];
    var h = '<h1 class="sx-h2">Tell us about your business</h1><p class="sx-sub">A few quick questions on one page. We use your answers to suggest options, and you can change them any time.</p>';
    h += q("Region", "region", FX.regions.map(function (r) { return { id: r.id, n: r.name, s: r.priced ? "USD list prices" : "Prices by Sales in this prototype" }; }), c.region, "cep-tiles");
    h += q("Company size", "size", FX.sizes.map(function (z) { return { id: z.id, n: z.range, s: z.who }; }), c.size, "cep-tiles");
    h += q("Industry", "industry", FX.industries.map(function (i) { return { id: i.id, n: i.name, icon: "assets/industry-icons/" + i.icon + ".svg" }; }), c.industry, "cep-tiles");
    var common = ind && ind.common && ind.common.length ? ind.common : [];
    var gcard = function (g) {
      var on = c.goals.indexOf(g.id) >= 0;
      return '<button type="button" class="sx-opt cep-goal' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-act="goal" data-id="' + g.id + '">' + GOAL_GLYPH[g.id] + '<span class="sx-opt__n">' + esc(g.name) + '</span><span class="sx-opt__s">' + esc(g.desc) + "</span></button>";
    };
    h += '<fieldset class="sx-q"><legend class="sx-q__l">What do you want to achieve?</legend><p class="sx-why">' + CEP.ic.info + "<span>" + (common.length ? "Suggested based on your industry. " : "") + "Pick 1–3 goals (up to 4). Goals help us suggest options; they don’t add products or prices on their own.</span></p>";
    if (common.length) {
      h += '<h3 class="cep-gh">Suggested for ' + esc(ind.name) + '</h3><div class="cep-tiles">' + FX.goals.filter(function (g) { return common.indexOf(g.id) >= 0; }).map(gcard).join("") + "</div>";
      h += '<h3 class="cep-gh">Other goals</h3><div class="cep-tiles">' + FX.goals.filter(function (g) { return common.indexOf(g.id) < 0; }).map(gcard).join("") + "</div>";
    } else h += '<div class="cep-tiles">' + FX.goals.map(gcard).join("") + "</div>";
    if (c.goals.length >= 4) h += '<p class="sx-fine">You’ve picked 4 goals, the most this prototype supports. Remove one to pick another.</p>';
    h += "</fieldset>";
    var n = c.goals.length;
    h += stepNav("#/", "Back", "#/recommend", "See options", { act: "toOptions", disabled: !n, hint: n ? n + " goal" + (n > 1 ? "s" : "") + " selected" : "Pick at least one goal to see options" });
    return CEP.page('<div class="cep-explore">' + h + "</div>", { crumbs: CEP.crumbs(STEPS, 0) });
  };
  function q(label, key, opts, cur, cls) {
    return '<fieldset class="sx-q"><legend class="sx-q__l">' + esc(label) + ' <span class="cep-opt">(optional)</span></legend><div class="' + cls + '">' + opts.map(function (o) {
      var on = cur === o.id;
      var ico = o.icon ? '<img class="sx-ind ind-ico" src="' + o.icon + '" alt="" />' : "";
      return '<button type="button" class="sx-opt' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-act="ctx" data-k="' + key + '" data-id="' + o.id + '">' + ico + '<span class="sx-opt__n">' + esc(o.n) + "</span>" + (o.s ? '<span class="sx-opt__s">' + esc(o.s) + "</span>" : "") + "</button>";
    }).join("") + "</div></fieldset>";
  }
  A.ctx = function (el) {
    var k = el.getAttribute("data-k"), id = el.getAttribute("data-id"), c = S().ctx;
    c[k] = c[k] === id && k !== "region" ? null : id;
    if (k === "size") S().pub.seats = null;
    if (k === "region") { var rg = E.region(id); if (rg && rg.ineligible && rg.ineligible.indexOf(S().pub.ed) >= 0) S().pub.ed = null; }
    S().pub.edPicked = false; // answers changed: follow the new recommendation
    CEP.track("context_changed", { field: k, value: c[k] }); CEP.save(); CEP.render();
  };
  A.goal = function (el) {
    var id = el.getAttribute("data-id"), g = S().ctx.goals, i = g.indexOf(id);
    if (i >= 0) g.splice(i, 1); else if (g.length < 4) g.push(id); else { CEP.toast("Up to 4 goals in this prototype"); return; }
    if (E.goal(id).needsUsage && i < 0 && !S().pub.actions) S().pub.actions = FX.usage.defaultActions;
    S().pub.edPicked = false;
    CEP.track("context_changed", { field: "goals", value: g.slice() }); CEP.save(); CEP.render();
  };
  I.free = function (el) { S().ctx.freeText = el.value; CEP.save(); };
  A.suggest = function () {
    var inp = document.getElementById("free"); if (inp) S().ctx.freeText = inp.value;
    var r = E.suggestGoals(S().ctx.freeText);
    S().ctx.suggested = r.ids; S().ctx.suggestRan = true;
    CEP.track("goal_suggested", { understood: r.understood, ids: r.ids }); CEP.save(); CEP.render();
  };
  A.toOptions = function () { if (!S().ctx.goals.length) { CEP.toast("Pick at least one goal first"); return; } CEP.go("#/recommend"); };

  /* ═════════ STEP 2 · OPTIONS: why-blade + one comparison table ═════════ */
  R["/recommend"] = function () {
    var s = S(), c = s.ctx, ent = CEP.isEnt();
    if (!c.goals.length) { CEP.afterRender = function () { location.replace(location.href.split("#")[0] + "#/explore"); }; return R["/explore"](); }
    s.pub.lastRoute = "#/recommend";
    var o = E.options({ size: c.size, region: c.region, goals: c.goals, seats: s.pub.seats });
    var rg = E.region(c.region), priced = rg && rg.priced && !ent;
    var show = o.options;
    if (show.length > 3) { var ri = Math.max(0, show.map(function (x) { return x.id; }).indexOf(o.recommended)); var st = Math.min(Math.max(0, ri - 1), show.length - 3); show = show.slice(st, st + 3); }
    var rec = show.filter(function (x) { return x.id === o.recommended; })[0] || show[0];
    if (!s.pub.edPicked || !s.pub.ed || !show.some(function (x) { return x.id === s.pub.ed; })) { s.pub.edPicked = false; s.pub.ed = rec.id; if (!s.pub.seats) s.pub.seats = o.seats; if (E.ed(rec.id).billing.indexOf(s.pub.billing) < 0) s.pub.billing = "annual"; CEP.save(); }
    var chosen = s.pub.ed;
    var h = '<h1 class="sx-h2">Your recommended option</h1><p class="sx-sub">Based on your answers. ' + (ent ? "For companies your size, a Salesforce specialist prepares your pricing." : "Compare it with the alternatives below. Prices are illustrative list prices.") + "</p>";
    if (rg && !rg.priced) h += CEP.note("w", "<strong>Prices for " + esc(rg.name) + " aren’t in this prototype.</strong> We show options and coverage, but not converted prices." + (rg.ineligible ? " Starter Suite isn’t offered in this region (synthetic rule)." : ""));
    if (o.complex) h += CEP.note("w", "<strong>This may need specialist help.</strong> " + esc(o.complexWhy.join(" ")) + " We won’t add those products for you.");
    if (o.options.every(function (x) { return x.reach === 0; })) h += CEP.note("w", "None of these options covers your goals on its own. <a href=\"#/explore\">Change your goals</a> or talk to Sales on the last step.");

    // why-blade
    var e = rec.edition;
    h += '<section class="cep-why-blade" aria-labelledby="why-h"><div class="cep-why-blade__top"><div><span class="cep-badge">★ Recommended for you</span><h2 class="sx-h3" id="why-h">Why we recommend ' + esc(e.name) + '</h2><p class="sx-mod__d">' + esc(e.blurb) + "</p></div>" +
      (priced ? '<div class="cep-why-blade__p"><strong>' + E.money(CEP.uv(e.price)) + "</strong><span>" + CEP.perUnitLbl("user (seat)") + "</span><small>" + CEP.pt(rec.baseAnnual) + " for " + E.num(rec.seats) + " users (seats) · " + CEP.billNote(e.billing.indexOf("monthly") >= 0 && s.pub.billing === "monthly") + "</small></div>" :
        '<div class="cep-why-blade__p"><span class="cep-tailored">' + (ent ? "Tailored pricing<small>A specialist prepares your price</small>" : "Priced by Sales<small>Not available for your region</small>") + "</span></div>") + "</div>";
    h += '<p class="cep-why-blade__sum"><strong>' + (rec.reach === rec.rows.length ? "It can cover all " + rec.rows.length + " of your goals" : "It covers the most of your goals (" + rec.reach + " of " + rec.rows.length + ")") + (rec.suggested.length ? " with " + rec.suggested.length + " add-on" + (rec.suggested.length > 1 ? "s" : "") : " on its own") + (ent ? ", with the fewest extra products." : ", at the lowest estimated cost among options that do.") + "</strong></p>";
    h += '<ul class="cep-why-blade__g">' + rec.rows.map(function (r) { return "<li>" + (r.base === "full" ? CEP.ic.check : r.base === "partial" ? CEP.ic.part : CEP.ic.gap) + "<span><strong>" + esc(r.goal.name) + "</strong> " + esc(r.reason) + "</span></li>"; }).join("") + "</ul>";
    if (rec.suggested.length) h += '<p class="cep-why-blade__need"><strong>Would also need (not added yet):</strong> ' + rec.suggested.map(function (m) { var mm = E.mod(m); var up = E.modUnitPrice(mm, e); return esc(mm.name) + (priced ? " (" + (up === null ? "priced by Sales" : (mm.status === "from" ? "from " : "") + CEP.pu(up, mm.unit)) + ")" : ""); }).join(", ") + ". You choose these in the next step.</p>";
    if (rec.unmet.length) h += '<p class="sx-gl__w">Can’t fully cover: ' + rec.unmet.map(function (r) { return esc(r.goal.name); }).join(", ") + "</p>";
    h += '<div class="sx-btnrow">' + (chosen === rec.id ? '<span class="sx-chip is-est">Selected</span>' : '<button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="pickEd" data-id="' + rec.id + '">Use ' + esc(short(e)) + " instead</button>") + "</div></section>";

    // comparison table (main column; the blade above is full width)
    var top = '<div class="cep-top">' + h + "</div>"; h = "";
    h += '<div class="cep-row-between cep-cmp-head"><h2 class="sx-h3" id="cmp" style="margin:0">Compare options</h2>' + (priced ? '<div class="sx-row cep-cmp-ctl"><div class="cep-inline"><label class="sx-lbl" for="seats">Users (seats)</label>' + stepper("seats", o.seats, "users (seats)") + "</div>" + CEP.periodToggle("pt-opt") + "</div>" : "") + "</div>";
    h += '<div class="sx-tblw"><table class="sx-tbl cep-cmp"><caption class="sx-vh">Option comparison. The recommended option is marked.</caption><thead><tr><th scope="col">Compare</th>' + show.map(function (x) {
      var isRec = x.id === rec.id;
      return '<th scope="col" class="' + (isRec ? "is-rec" : "") + '">' + (isRec ? '<span class="cep-badge">★ Recommended</span>' : "") + esc(x.edition.name) + (s.pub.edPicked && x.id === chosen && x.id !== rec.id ? '<small>Your choice</small>' : "") + "</th>";
    }).join("") + "</tr></thead><tbody>";
    function trow(label, f, tip) {
      return '<tr><th scope="row"><span class="cep-th-lab">' + esc(label) + (tip ? CEP.infoTip(label, tip) : "") + "</span></th>" + show.map(function (x) { return '<td class="' + (x.id === rec.id ? "is-rec" : "") + '">' + f(x) + "</td>"; }).join("") + "</tr>";
    }
    h += trow("Price", function (x) { return priced ? '<strong class="cep-cmp-p">' + E.money(CEP.uv(x.perUser)) + "</strong><small>" + CEP.perUnitLbl("user (seat)") + "</small><small>" + CEP.pt(x.baseAnnual) + " for " + E.num(x.seats) + " users (seats)</small>" : '<span class="cep-tailored">' + (ent ? "Tailored" : "Priced by Sales") + "</span>"; }, ROW_TIPS.Price);
    h += trow("Goals covered", function (x) { return "<strong>" + x.full + " of " + x.rows.length + "</strong> on its own" + (x.reach > x.full ? "<small>" + x.reach + " with add-ons</small>" : ""); }, ROW_TIPS["Goals covered"]);
    c.goals.forEach(function (gid) {
      var g = E.goal(gid);
      h += trow(g.name, function (x) {
        var r = x.rows.filter(function (rr) { return rr.goal.id === gid; })[0];
        return '<span class="sx-lv">' + (r.base === "full" ? CEP.ic.check + " Covered" : r.base === "partial" ? CEP.ic.part + " Partly" : CEP.ic.gap + " Not covered") + "</span>" + (r.fixes.length ? "<small>Needs " + r.fixes.map(function (f) { return esc(E.mod(f).name); }).join(", ") + "</small>" : (r.needsUpgrade ? "<small>Needs a higher edition</small>" : ""));
      }, g.desc);
    });
    h += trow("Flex Credits included", function (x) { return x.edition.credits ? E.credits(x.edition.credits) + " per org/year" : '<span class="sx-na">None</span>'; }, ROW_TIPS["Flex Credits included"]);
    h += trow("Slack", function (x) { return esc(x.edition.slack); }, ROW_TIPS.Slack);
    h += trow("Billing", function (x) { return x.edition.billing.indexOf("monthly") >= 0 ? "Monthly or annual" : "Annual contract"; }, ROW_TIPS.Billing);
    h += trow("Try first", function (x) { var t = FX.trials[x.id]; return t ? esc(t.name) + "<small>30 days</small>" : "—"; }, ROW_TIPS["Try first"]);
    h += trow("Limitations", function (x) { return "<small>" + x.edition.limits.map(featLine).join("<br>") + "</small>"; }, ROW_TIPS.Limitations);
    h += '<tr class="cep-cmp-act"><th scope="row"></th>' + show.map(function (x) { return '<td class="' + (x.id === rec.id ? "is-rec" : "") + '">' + (x.id === chosen ? '<span class="sx-chip is-est">Selected</span>' : '<button class="sx-link" data-act="pickEd" data-id="' + x.id + '">Choose ' + esc(short(x.edition)) + " instead</button>") + "</td>"; }).join("") + "</tr>";
    h += "</tbody></table></div>";
    h += '<p class="sx-fine">' + (ent ? "Enterprise pricing is tailored by Sales. Public list prices are on the packaged editions page." : "Source: " + esc(FX.meta.priceSource) + ". Illustrative list prices for research; not a quote. Excludes taxes.") + "</p>";
    h += stepNav("#/explore", "Back", "#/estimate", "Customize", { act: "toCustomize" });
    CEP.track("recommendation_viewed", { rec: rec.id });
    return CEP.page(h, { rail: true, top: top, crumbs: CEP.crumbs(STEPS, 1) });
  };
  function short(e) {
    var map = {
      st: "Starter", pro: "Pro Suite", core: "Sales Core", adv: "Sales Advanced", max: "Sales Max",
      svc_core: "Service Core", svc_adv: "Service Advanced", svc_max: "Service Max",
      crm_core: "Sales & Service Core", crm_adv: "Sales & Service Advanced", crm_max: "Sales & Service Max"
    };
    return map[e.id] || e.name;
  }
  function row(label, cells, tip) {
    return '<tr><th scope="row">' + (label ? '<span class="cep-th-lab">' + esc(label) + (tip ? CEP.infoTip(label, tip) : "") + "</span>" : "") + "</th>" + cells.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
  }
  A.pickEd = function (el) {
    var id = el.getAttribute("data-id"), s = S(), prev = s.pub.ed;
    s.pub.ed = id; s.pub.edPicked = true; if (!s.pub.seats) { var sz = E.size(s.ctx.size); s.pub.seats = sz ? sz.seats : 10; }
    if (E.ed(id).billing.indexOf(s.pub.billing) < 0) s.pub.billing = "annual";
    CEP.pruneAccepted(id);
    CEP.track("sku_selected", { edition: id, from: prev }); CEP.track("option_compared", { chosen: id });
    CEP.save(); CEP.render();
  };
  A.toCustomize = function () { var s = S(); s.pub.origin = "guided"; CEP.track("next_step_selected", { next: "customize", edition: s.pub.ed }); CEP.save(); CEP.go("#/estimate"); };
  A.chooseEd = function (el) { // used by the editions page and the Customize edition switcher
    var id = el.getAttribute("data-id"), s = S(), prev = s.pub.ed;
    s.pub.ed = id; s.pub.edPicked = true; if (!s.pub.seats) { var sz = E.size(s.ctx.size); s.pub.seats = sz ? sz.seats : 10; }
    if (E.ed(id).billing.indexOf(s.pub.billing) < 0) s.pub.billing = "annual";
    if (el.getAttribute("data-origin")) s.pub.origin = el.getAttribute("data-origin");
    CEP.pruneAccepted(id);
    CEP.track("sku_selected", { edition: id, from: prev });
    CEP.save(); if (CEP.route() === "/estimate") CEP.render(); else CEP.go("#/estimate");
  };
  function stepper(id, val, unit) {
    return '<div class="sx-stepper"><button type="button" aria-label="Decrease ' + esc(unit) + '" data-act="step" data-k="' + id + '" data-d="-1">−</button><input id="' + id + '" type="number" min="1" inputmode="numeric" value="' + val + '" data-in="' + id + '" aria-label="Number of ' + esc(unit) + '" /><button type="button" aria-label="Increase ' + esc(unit) + '" data-act="step" data-k="' + id + '" data-d="1">+</button><span class="cep-unit">' + esc(unit) + "</span></div>";
  }
  CEP.stepper = stepper;
  A.step = function (el) {
    var k = el.getAttribute("data-k"), d = +el.getAttribute("data-d");
    if (k === "seats") { var v = Math.max(1, (CEP.sel().seats || 1) + d * (CEP.sel().seats >= 50 ? 5 : 1)); S().pub.seats = v; CEP.track("price_assumptions_changed", { seats: v }); }
    else if (k === "actions") { S().pub.actions = Math.max(0, (S().pub.actions || 0) + d * 1000); CEP.track("price_assumptions_changed", { actions: S().pub.actions }); }
    else if (CEP.stepHandlers && CEP.stepHandlers[k]) CEP.stepHandlers[k](d);
    CEP.save(); CEP.render();
  };
  I.seats = function (el) { var v = Math.max(1, Math.floor(+el.value || 1)); S().pub.seats = v; CEP.track("price_assumptions_changed", { seats: v }); CEP.save(); CEP.render(); };

  /* ═════════ COMPARE PACKAGED EDITIONS (product-led entry) ═════════ */
  var CATALOG = ["st", "pro", "core", "adv", "max", "svc_core", "svc_adv", "svc_max", "crm_core", "crm_adv", "crm_max"];
  var FAMILIES = [
    { id: "suites", name: "Starter and Pro Suite", eds: ["st", "pro"], d: "Starter Suite and Pro Suite." },
    { id: "sales", name: "Sales Cloud", eds: ["core", "adv", "max"], d: "Portfolio 2.0 Sales editions. List prices from the Product Explorer BOM: $195 / $395 / $550." },
    { id: "service", name: "Service Cloud", eds: ["svc_core", "svc_adv", "svc_max"], d: "Portfolio 2.0 Service editions. Same list prices as Sales: $195 / $395 / $550." },
    { id: "crm", name: "Sales & Service", eds: ["crm_core", "crm_adv", "crm_max"], d: "Combined CRM editions. Cheaper than buying Sales and Service separately ($250 / $475 / $675)." }
  ];
  function edCard(id) {
    var e = E.ed(id), rg = E.region(S().ctx.region);
    return '<article class="cep-edc"><h3 class="sx-h4">' + esc(e.name) + '</h3><p class="cep-edc__p">' + (rg.priced ? "<strong>" + CEP.pu(e.price, "user (seat)/mo") + "</strong><small>" + (e.billing.indexOf("monthly") >= 0 ? "Billed monthly or annually" : "Annual contract") + "</small>" : "<strong>Priced by Sales</strong><small>Not available for your region in this prototype</small>") + '</p><p class="sx-mod__d">' + esc(e.blurb) + '</p><ul class="cep-edc__l">' + e.includes.slice(0, 3).map(function (t) { return "<li>" + CEP.ic.check + "<span>" + esc(t) + "</span></li>"; }).join("") + "</ul>" +
      '<button class="sf-cta sf-cta--primary sf-cta--medium" data-act="chooseEd" data-id="' + id + '" data-origin="editions">Estimate this edition</button></article>';
  }
  R["/editions"] = function () {
    var s = S(); s.pub.lastRoute = "#/editions";
    var h = '<h1 class="sx-h2">Compare packaged editions</h1><p class="sx-sub">Ready-made editions that fit common business goals. This isn’t our full product catalog. Prices are illustrative list prices.</p>';
    h += '<div class="cep-notsure"><span>' + CEP.ic.info + " <strong>Not sure which one?</strong> Answer a few questions and we’ll recommend one.</span><a class=\"sf-cta sf-cta--secondary sf-cta--medium\" href=\"#/start\">Find my plan</a></div>";
    h += '<div class="cep-row-between cep-edhead"><h2 class="sx-h3" id="ed-all">Packaged editions</h2>' + CEP.periodToggle("pt-ed") + "</div>";
    h += '<p class="sx-mod__d">Starter, Pro, Sales, Service, and combined Sales &amp; Service editions. Compare any of them side by side.</p>';
    h += '<p><a class="sx-link" href="#/product">Compare side by side →</a></p>';
    h += '<div class="cep-edgrid">' + CATALOG.map(edCard).join("") + "</div>";
    h += '<section class="cep-edsec" aria-labelledby="ed-ai"><h2 class="sx-h3" id="ed-ai">AI agents (Agentforce)</h2><p class="sx-mod__d">If you want AI agents, this is how: pay per user, or by usage with Flex Credits.</p><div class="cep-edgrid cep-edgrid--2">' +
      '<article class="cep-edc"><h3 class="sx-h4">Agentforce add-on</h3><p class="cep-edc__p"><strong>' + CEP.pu(125, "user (seat)/mo") + '</strong><small>Included in every Max edition</small></p><p class="sx-mod__d">Unmetered AI agents for your own employees, added to a Core or Advanced edition. Already in Sales Max, Service Max and Sales & Service Max.</p><button class="sf-cta sf-cta--primary sf-cta--medium" data-act="aiPlan">Find a plan with AI agents</button></article>' +
      '<article class="cep-edc"><h3 class="sx-h4">Flex Credits</h3><p class="cep-edc__p"><strong>$500 per 100K credits</strong><small>$0.005 per credit · 20 credits (about $0.10) per agent action</small></p><p class="sx-mod__d">Pay for agent actions and Data 360 usage. Every Core includes 500K, Advanced 1M, Max 2.75M — the same on Sales, Service and Sales & Service.</p><a class="sf-cta sf-cta--secondary sf-cta--medium" href="' + FX.links.flexCalculator + '" target="_blank" rel="noopener noreferrer">Estimate credits in the calculator</a></article></div></section>';
    h += '<p class="sx-fine">Tableau Next (Consumer + one Creator per org) is included in Portfolio 2.0 editions, not sold here as a standalone edition. Extra Viewers or Creators are outside this estimate.</p>';
    h += stepNav("#/", "Back", null, null);
    return CEP.page(h, {});
  };
  R["/browse"] = R["/editions"];
  A.aiPlan = function () { var c = S().ctx; if (c.goals.indexOf("g_ai") < 0 && c.goals.length < 4) c.goals.push("g_ai"); if (!S().pub.actions) S().pub.actions = FX.usage.defaultActions; CEP.track("context_changed", { field: "goals", via: "editions_ai" }); CEP.save(); CEP.go("#/explore"); };
  R["/product"] = function () {
    var s = S(), fid = (location.hash.split("f=")[1] || s.pub.browseProduct || "sales").split("&")[0];
    if (fid === "smb") fid = "suites";
    if (fid === "all" || fid === "tab") fid = "sales";
    s.pub.browseProduct = fid; s.pub.lastRoute = "#/product?f=" + fid;
    var f = FAMILIES.filter(function (x) { return x.id === fid; })[0] || FAMILIES[1];
    var h = '<p class="sx-eyebrow"><a href="#/editions">Packaged editions</a></p><h1 class="sx-h2">Edition comparison</h1>';
    h += '<div class="sx-seg" role="group" aria-label="Edition family">' + FAMILIES.map(function (fam) {
      return '<a class="sx-link" href="#/product?f=' + fam.id + '" aria-current="' + (fam.id === f.id ? "page" : "false") + '"' + (fam.id === f.id ? ' style="font-weight:700"' : "") + ">" + esc(fam.name) + "</a>";
    }).join(" · ") + "</div>";
    h += '<p class="sx-sub">' + esc(f.d) + "</p>";
    var seats = CEP.sel().seats, cur = s.pub.currency, rg = E.region(s.ctx.region);
    var monthlyOk = f.eds.some(function (id) { return E.ed(id).billing.indexOf("monthly") >= 0; });
    h += '<div class="sx-row cep-ctl"><div><label class="sx-lbl" for="seats">Users (seats)</label>' + stepper("seats", seats, "users (seats)") + "</div>" +
      '<div><span class="sx-lbl" id="bill-l">How you’re billed</span><div class="sx-seg" role="group" aria-labelledby="bill-l"><button aria-pressed="' + (s.pub.billing === "annual") + '" data-act="billing" data-v="annual">Annual</button><button aria-pressed="' + (s.pub.billing === "monthly") + '" data-act="billing" data-v="monthly"' + (monthlyOk ? "" : ' aria-disabled="true"') + ">Monthly</button></div></div>" +
      '<div><label class="sx-lbl" for="cur">Currency</label><select id="cur" data-in="cur">' + FX.currencies.map(function (c) { return "<option" + (c === cur ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select></div>" + (cur === "USD" && rg.priced ? "<div>" + CEP.periodToggle("pt-prod") + "</div>" : "") + "</div>";
    if (cur !== "USD") h += CEP.note("w", "<strong>" + esc(cur) + " prices aren’t available in this prototype.</strong> We don’t convert USD list prices, because local prices differ. Switch back to USD or <a href=\"#/handoff\">ask Sales for a local quote</a>.");
    if (!rg.priced) h += CEP.note("w", "Your region is set to " + esc(rg.name) + ". Prices shown are not available for that region in this prototype. <a href=\"#/explore\">Change region</a>.");
    if (s.pub.billing === "monthly") h += CEP.note("", "Monthly billing is only offered on Starter Suite. Other editions show annual pricing.");
    if (CEP.isEnt()) h += CEP.note("", "<strong>These are public list prices.</strong> For 1,000+ employees, pricing is tailored and may differ. <a href=\"#/handoff\">Talk to Sales</a> for your pricing.");
    h += '<div class="sx-tblw sx-mt"><table class="sx-tbl"><caption class="sx-vh">Edition comparison</caption><thead><tr><th scope="col">Edition</th>' + f.eds.map(function (id) { return '<th scope="col">' + esc(E.ed(id).name) + "</th>"; }).join("") + "</tr></thead><tbody>";
    h += row("Price", f.eds.map(function (id) {
      var e = E.ed(id), est = E.estimate({ ed: id, seats: seats, billing: s.pub.billing, accepted: {}, actions: 0, region: s.ctx.region, currency: cur });
      var el = rg.ineligible && rg.ineligible.indexOf(id) >= 0;
      if (el) return '<span class="sx-na">Not offered in ' + esc(rg.name) + "</span>";
      return est.priceable ? "<strong>" + CEP.pu(e.price, "user/mo") + "</strong><small>" + CEP.pt(est.knownAnnual) + " for " + seats + " users (seats) · " + CEP.billNote(e.billing.indexOf("monthly") >= 0 && s.pub.billing === "monthly") + "</small>" : "Not priced";
    }), ROW_TIPS.Price);
    h += row("Billing", f.eds.map(function (id) { return E.ed(id).billing.indexOf("monthly") >= 0 ? "Monthly or annual" : "Annual contract"; }), ROW_TIPS.Billing);
    h += row("Flex Credits included", f.eds.map(function (id) { var e = E.ed(id); return e.credits ? E.credits(e.credits) + "/org/yr" : '<span class="sx-na">None</span>'; }), ROW_TIPS["Flex Credits included"]);
    h += row("Included", f.eds.map(function (id) { return "<small>" + E.ed(id).includes.map(featLine).join("<br>") + "</small>"; }), ROW_TIPS.Included);
    h += row("Not included", f.eds.map(function (id) { return "<small>" + E.ed(id).limits.map(featLine).join("<br>") + "</small>"; }), ROW_TIPS["Not included"]);
    h += row("Try", f.eds.map(function (id) { var t = FX.trials[id]; return t ? esc(t.name) : "—"; }), ROW_TIPS.Try);
    h += row("", f.eds.map(function (id) { var el = rg.ineligible && rg.ineligible.indexOf(id) >= 0; return '<button class="sf-cta sf-cta--primary sf-cta--medium" data-act="chooseEd" data-id="' + id + '" data-origin="editions"' + (el ? ' aria-disabled="true"' : "") + ">Estimate this edition</button>"; }));
    h += "</tbody></table></div>";
    var seatOver = f.eds.indexOf("st") >= 0 && seats > 10;
    if (seatOver) h += CEP.note("w", "Starter Suite is for teams of up to 10 users. For " + seats + " users, compare Pro Suite or Sales Cloud.");
    h += '<p class="sx-fine">Totals exclude taxes, usage and implementation. Source: ' + esc(FX.meta.priceSource) + ". Illustrative for research.</p>";
    h += stepNav("#/editions", "Back to editions", null, null);
    return CEP.page(h, {});
  };
  A.billing = function (el) { S().pub.billing = el.getAttribute("data-v"); CEP.track("price_assumptions_changed", { billing: S().pub.billing }); CEP.save(); CEP.render(); };
  I.cur = function (el) { S().pub.currency = el.value; CEP.track("price_assumptions_changed", { currency: el.value }); CEP.save(); CEP.render(); };

  /* ═════════ STEP 3 · CUSTOMIZE ═════════ */
  function backFromCustomize() { return S().pub.origin === "editions" ? ["#/editions", "Back to editions"] : ["#/recommend", "Back"]; }
  R["/estimate"] = function () {
    var s = S(), bk = backFromCustomize();
    if (CEP.isEnt()) {
      s.pub.lastRoute = "#/estimate";
      var ed = s.pub.ed ? E.ed(s.pub.ed) : null;
      var hh = '<h1 class="sx-h2">Let’s build your pricing together</h1><p class="sx-sub">For companies with 1,000+ employees we don’t show a generic estimate. Pricing depends on volume, term, commitment options and your product mix, so a specialist prepares it with you.</p>';
      hh += '<div class="cep-ent"><h2 class="sx-h4" style="margin-top:0">What we’ll share with your specialist</h2><ul class="cep-kv"><li><span>Goals</span>' + (s.ctx.goals.map(function (g) { return esc(E.goal(g).name); }).join(", ") || "None yet") + "</li><li><span>Option</span>" + (ed ? esc(ed.name) : "Not chosen yet") + "</li><li><span>Company</span>" + [labelOf("industry"), labelOf("size"), labelOf("region")].filter(Boolean).map(esc).join(" · ") + "</li></ul>" +
        '<h2 class="sx-h4">What happens next</h2><ol><li>You share your goals and contact details. You choose exactly what’s shared.</li><li>A specialist reviews your goals and current systems with you.</li><li>You get tailored pricing, including volume and commitment options, plus a trial or proof of concept if you want one.</li></ol>' +
        '<div class="sx-btnrow sx-mt"><a class="sf-cta sf-cta--primary sf-cta--hero" href="#/handoff" data-act="next" data-v="sales" data-allow-disabled>Talk to Sales</a></div></div>';
      hh += '<p class="sx-fine">Not 1,000+ employees? <a href="#/explore">Change company size</a> to see an estimate.</p>';
      hh += stepNav(bk[0], bk[1], "#/next", "Next steps");
      CEP.track("estimate_rendered", { enterprise: true, tailored: true });
      return CEP.page(hh, { rail: true, crumbs: CEP.crumbs(STEPS, 2) });
    }
    if (!s.pub.ed) return CEP.page('<h1 class="sx-h2">Choose an option first</h1><p class="sx-sub">Your answers are saved.</p>' + stepNav("#/recommend", "Back to options", null, null), { rail: true, crumbs: CEP.crumbs(STEPS, 2) });
    s.pub.lastRoute = "#/estimate";
    var est = CEP.est(), e = est.edition, sel = CEP.sel();
    var h = '<h1 class="sx-h2">Customize your estimate</h1><p class="sx-sub">Your main number comes first. Adjust the edition and users (seats), then include add-ons if you need them.</p>';
    // 1 configuration
    var sz = E.size(s.ctx.size), eds = sz ? sz.eds : ["st", "pro", "core", "adv", "max"];
    if (eds.indexOf(e.id) < 0) eds = eds.concat([e.id]);
    h += '<div class="sx-cb"><h2 class="sx-h4" style="margin-top:0">Edition and users (seats)</h2><div class="sx-seg" role="group" aria-label="Edition">' + eds.map(function (id) { return '<button aria-pressed="' + (id === e.id) + '" data-act="chooseEd" data-id="' + id + '">' + esc(short(E.ed(id))) + "</button>"; }).join("") + "</div>" +
      '<div class="sx-row" style="margin-top:16px"><div><label class="sx-lbl" for="seats">Users (seats)</label>' + stepper("seats", sel.seats, "users (seats)") + "</div>" +
      (e.billing.indexOf("monthly") >= 0 ? '<div><span class="sx-lbl" id="b2">How you’re billed</span><div class="sx-seg" role="group" aria-labelledby="b2"><button aria-pressed="' + (s.pub.billing === "annual") + '" data-act="billing" data-v="annual">Annual</button><button aria-pressed="' + (s.pub.billing === "monthly") + '" data-act="billing" data-v="monthly">Monthly</button></div></div>' : '<div><span class="sx-lbl">How you’re billed</span><p class="sx-mod__d">Annual contract</p></div>') + "</div>";
    est.lines.forEach(function (l) { if (l.warn) h += CEP.note("w", esc(l.warn)); });
    est.notes.forEach(function (n) { h += CEP.note("", esc(n)); });
    h += "</div>";
    // 2 main number + table
    h += '<div class="sx-cb cep-total"><div class="sx-est__tot"><div class="sx-est__a"><span>' + (est.partial ? "Known subtotal (partial)" : (CEP.isMo() ? "Estimated monthly total" : "Estimated annual total")) + "</span><strong>" + (est.priceable ? E.money(CEP.pv(est.knownAnnual)) : "Not priced") + "</strong><small>" + (est.priceable ? CEP.perLbl() + " · " + CEP.billNote(e.billing.indexOf("monthly") >= 0 && s.pub.billing === "monthly") + (CEP.isMo() ? " · " + E.money(est.knownAnnual) + "/yr" : " · about " + E.money(est.monthly) + "/mo") + " · USD · excludes taxes" : esc(est.unpricedWhy)) + "</small></div><div class=\"cep-tot-r\">" + CEP.status(est.status) + (est.priceable ? CEP.periodToggle("pt-est") : "") + "</div></div>";
    if (est.partial && est.hasFrom && !est.unknown.length) h += CEP.note("w", "<strong>Includes a starting price.</strong> MuleSoft is published as “from” a price, so your final cost may be higher.");
    if (est.partial && est.unknown.length) h += CEP.note("w", "<strong>Not included in the total:</strong> " + est.unknown.map(esc).join(", ") + ". These aren’t $0. They need a price from Sales or a compatible edition.");
    h += '<div class="sx-tblw sx-mt"><table class="sx-tbl sx-tbl--est"><caption class="sx-vh">Estimate line items</caption><thead><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">' + (CEP.isMo() ? "Monthly" : "Annual") + '</th></tr></thead><tbody>';
    h += sect("Software (recurring)");
    est.lines.filter(function (l) { return l.cat === "software"; }).forEach(function (l) { h += lineRow(l); });
    if (est.lines.some(function (l) { return l.cat === "consumption"; })) { h += sect("Usage (variable)"); est.lines.filter(function (l) { return l.cat === "consumption"; }).forEach(function (l) { h += lineRow(l); }); }
    h += '<tr class="is-total"><th scope="row">' + (est.partial ? "Known subtotal" : "Total") + "</th><td></td><td>" + (est.priceable ? CEP.pt(est.knownAnnual) : "—") + "</td></tr>";
    h += sect("Included at no extra charge");
    h += '<tr><th scope="row">With ' + esc(e.name) + "<small>Counted once, not charged again</small></th><td colspan=\"2\">" + est.included.map(esc).join(" · ") + "</td></tr>";
    h += sect("Implementation services (one-time, not in total)");
    var sv = est.services;
    h += '<tr><th scope="row">' + esc(sv.band.label) + "<small>" + esc(sv.band.when) + '</small></th><td colspan="2">' + (sv.show ? E.money(sv.band.low) + " – " + E.money(sv.band.high) + " " + CEP.status("synthetic") + "<small>Indicative range, not a price. Depends on scope and partner.</small>" : "Range pending Services approval <small>Not $0. Unknown until scoped.</small>") + "</td></tr>";
    h += sect("Not included");
    h += '<tr><th scope="row">Excluded costs</th><td colspan="2"><small>' + sv.excluded.map(esc).join(" · ") + "</small></td></tr>";
    h += "</tbody></table></div></div>";
    CEP.track("estimate_rendered", { known: est.knownAnnual, partial: est.partial });
    if (est.partial) CEP.track("estimate_partial", { unknown: est.unknown });
    // 3 add-ons (below the main number)
    var rel = relevantModules(e.id);
    if (rel.length) {
      h += '<div class="sx-cb"><h2 class="sx-h4" style="margin-top:0">Add-ons</h2><p class="sx-mod__d">Suggested from your goals. Nothing is added until you include it.</p><div class="sx-mods">' + rel.map(function (m) {
        var inc = m.includedIn && m.includedIn.indexOf(e.id) >= 0, ok = CEP.modOk(m, e.id);
        var on = ok && s.pub.accepted[m.id] !== undefined;
        var up = E.modUnitPrice(m, e);
        var price = up === null ? "Priced by Sales" : (m.status === "from" ? "From " : "") + CEP.pu(up, m.unit);
        var why = m.goalName ? "For “" + esc(m.goalName) + "”: " : "";
        var act = inc ? '<span class="sx-chip is-est">Included in ' + esc(short(e)) + "</span>" : (!ok ? '<span class="sx-chip is-pre">Not available on this edition</span>' :
          '<button class="sf-cta sf-cta--' + (on ? "secondary" : "primary") + ' sf-cta--medium" data-act="toggleMod" data-id="' + m.id + '" aria-pressed="' + on + '">' + (on ? "Remove" : "Include") + "</button>");
        var qty = on && ok && !inc && m.qtyFrom !== "org" ? '<div class="sx-mod__c"><label class="sx-lbl" for="q-' + m.id + '">' + (m.qtyFrom === "profiles" ? "Thousands of profiles" : "Users (seats)") + '</label><input id="q-' + m.id + '" type="number" min="1" value="' + s.pub.accepted[m.id] + '" data-in="modQty" data-id="' + m.id + '" /></div>' : "";
        var declined = s.pub.declined[m.id] && !on && ok && m.goalName ? '<p class="sx-gl__w">Not included, so “' + esc(m.goalName) + "” stays not fully covered.</p>" : "";
        var unavailable = !ok && !inc ? '<p class="sx-gl__w">Not available with ' + esc(e.name) + ". It is not selected and is excluded from the total.</p>" : "";
        return '<div class="sx-mod' + (on ? " is-on" : "") + (ok ? "" : " is-off") + '"' + (ok ? "" : ' aria-disabled="true"') + '><div class="sx-mod__t"><strong>' + esc(m.name) + '</strong><span class="sx-mod__d">' + why + esc(m.why) + '</span><span class="sx-mod__p">' + price + " " + (m.status !== "illustrative" ? CEP.status(m.status) : "") + "</span>" + qty + declined + unavailable + '</div><div class="sx-mod__a">' + act + "</div></div>";
      }).join("") + "</div></div>";
    }
    // 4 AI usage
    var showUsage = s.ctx.goals.indexOf("g_ai") >= 0 || s.pub.actions > 0 || s.pub.accepted.afaddon !== undefined;
    if (showUsage) {
      h += '<div class="sx-cb"><h2 class="sx-h4" style="margin-top:0">AI agent usage (variable)</h2>';
      if (E.isSmb(e.id)) h += CEP.note("w", "AI agents aren’t available on " + esc(e.name) + ". Choose a Core or higher CRM edition to include agent usage, or set usage to 0.");
      h += '<label class="sx-lbl" for="actions">Agent actions per month</label>' + stepper("actions", s.pub.actions || 0, "actions/mo");
      if (est.credits) {
        var cc = est.credits;
        h += '<ul class="sx-calc__l"><li>Annual need: <strong>' + E.credits(cc.annual) + "</strong> Flex Credits (" + E.num(s.pub.actions) + " × 20 × 12)</li><li>Covered by credits included with " + esc(e.name) + ": <strong>" + E.credits(cc.covered) + "</strong> of " + E.credits(cc.included) + "</li><li>Incremental: <strong>" + E.credits(cc.incremental) + "</strong> → " + cc.packs + " × 100K packs at $500 each = <strong>" + (est.priceable ? CEP.pt(cc.cost) : "not priced") + "</strong>" + (CEP.isMo() && est.priceable ? " (monthly equivalent of " + E.money(cc.cost) + "/yr)" : "") + "</li></ul>";
        h += '<p class="sx-fine">Your input, not a forecast. Size usage in detail with the <a href="' + FX.links.flexCalculator + '" target="_blank" rel="noopener noreferrer">public Flex Credit Pricing Calculator ' + CEP.ic.ext + "</a> (opens in a new tab).</p>";
      }
      h += "</div>";
    }
    // 5 buying model
    if (est.credits && est.credits.incremental > 0) {
      h += '<div class="sx-cb"><h2 class="sx-h4" style="margin-top:0">How you’d pay for usage</h2><div class="sx-bill">' + FX.buyingModels.map(function (b) {
        var chk = E.buyingModelCheck(b.id, e.id, s.pub.accepted, true);
        return '<button class="sx-bm' + (s.pub.model === b.id ? " is-on" : "") + (chk.ok ? "" : " is-off") + '" data-act="model" data-id="' + b.id + '" aria-pressed="' + (s.pub.model === b.id) + '"' + (chk.ok ? "" : ' aria-disabled="true" data-allow-disabled') + "><strong>" + esc(b.name) + "</strong>" + esc(b.desc) + (chk.ok ? "" : "<em>" + esc(chk.reasons.join(" ")) + " Try " + chk.alternative + ".</em>") + "</button>";
      }).join("") + '</div><p class="sx-fine">Salesforce publishes no list-price difference between these models, so the total doesn’t change. No discount is implied.</p></div>';
    }
    h += '<details class="sx-det sx-det--box"><summary>Assumptions and price details</summary><ul>' + est.assumptions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "<li>Price source: " + esc(FX.meta.priceSource) + ". Status: illustrative list price, not approved for customer use.</li></ul></details>";
    h += stepNav(bk[0], bk[1], "#/next", "Next steps");
    return CEP.page(h, { rail: true, crumbs: CEP.crumbs(STEPS, 2) });
  };

  /* ═════════ STEP 4 · NEXT STEPS (final page) ═════════ */
  R["/next"] = function () {
    var s = S(), ent = CEP.isEnt();
    if (!s.pub.ed && !ent) return R["/estimate"]();
    s.pub.lastRoute = "#/next";
    var est = CEP.est(), e = s.pub.ed ? E.ed(s.pub.ed) : null, tr = e ? FX.trials[e.id] : null;
    var h = '<h1 class="sx-h2">Choose your next step</h1>';
    if (e) h += '<div class="cep-sumstrip"><span><strong>' + esc(e.name) + "</strong> · " + E.num(CEP.sel().seats) + " users (seats)</span><span>" + (ent ? "Tailored pricing with Sales" : est && est.priceable ? "<strong>" + CEP.pt(est.knownAnnual) + "</strong> " + (est.partial ? "known subtotal" : "estimated") + " · illustrative list price" : "Not priced for your region") + "</span></div>";
    if (s.me.signedIn) h += '<p class="sx-fine">Signed in as ' + esc(s.me.email) + ' (simulated) · <button class="sx-link" data-act="meOut">Sign out</button></p>';
    var trialCard = '<article class="cep-nextc' + (ent ? "" : " is-primary") + '"><h2 class="sx-h4">Start a free trial</h2><p class="sx-mod__d">' + (tr ? esc(tr.name) + ": " + esc(tr.duration) + ", " + esc(tr.card.toLowerCase()) + ". Pick a use case for your industry and we’ll guide your first steps." : "30-day trial on salesforce.com.") + '</p><p class="sx-fine">Sign in or create an account to start.</p><button class="sf-cta sf-cta--' + (ent ? "secondary" : "primary") + ' sf-cta--medium" data-act="gate" data-g="trial">Start free trial</button></article>';
    var salesCard = '<article class="cep-nextc' + (ent ? " is-primary" : "") + '"><h2 class="sx-h4">Talk to Sales</h2><p class="sx-mod__d">' + (ent ? "A specialist prepares tailored pricing, including volume and commitment options." : "Get help from a specialist. You see exactly what’s shared first.") + '</p><a class="sf-cta sf-cta--' + (ent ? "primary sf-cta--hero" : "secondary sf-cta--hero") + '" href="#/handoff" data-act="next" data-v="sales" data-allow-disabled>Talk to Sales</a></article>';
    var saveCard = ent ? "" : '<article class="cep-nextc"><h2 class="sx-h4">Save and compare</h2><p class="sx-mod__d">Keep this estimate, compare versions side by side, or download a summary.</p><p class="sx-fine">Sign in or create an account first.</p><div class="sx-btnrow"><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="gate" data-g="save">Save this estimate</button><button class="sx-link" data-act="gate" data-g="compare">Compare saved' + (s.pub.saved.length ? " (" + s.pub.saved.length + ")" : "") + '</button><button class="sx-link" data-act="gate" data-g="download">Download summary</button></div></article>';
    h += '<div class="cep-next">' + (ent ? salesCard + trialCard : trialCard + salesCard + saveCard) + "</div>";
    if (e && E.isSmb(e.id) && !ent) h += '<p class="sx-fine">Ready to buy ' + esc(e.name) + '? <button class="sx-link" data-act="buyOnline">Buy online</button></p>';
    else if (e && !ent) h += '<p class="sx-fine">' + esc(e.name) + " is bought with a Salesforce account team, so there’s no online checkout.</p>";
    h += stepNav("#/estimate", "Back", null, null);
    return CEP.page(h, { rail: true, crumbs: CEP.crumbs(STEPS, 3) });
  };

  /* ── account gate: Save, Compare, Download and Start free trial ── */
  var GATES = {
    save: function () { A.saveScenario(); },
    compare: function () { CEP.go("#/compare"); },
    download: function () { A.downloadSummary(); },
    trial: function () { CEP.track("next_step_selected", { next: "try" }); CEP.go("#/try"); }
  };
  var GATE_WHY = { save: "save this estimate", compare: "compare your saved estimates", download: "download your summary", trial: "start your free trial" };
  A.gate = function (el) {
    var g = el.getAttribute("data-g"), s = S();
    if (s.me.signedIn) { GATES[g](); return; }
    s.pendingGate = g; s.gateMode = s.gateMode || "signin"; CEP.save(); drawGate();
  };
  CEP.requireAccount = function (g) { A.gate({ getAttribute: function () { return g; } }); };
  function drawGate(err) {
    var s = S();
    CEP._lastFocus = document.activeElement;
    var root = document.getElementById("modal-root");
    root.innerHTML = '<div class="sx-modal" role="dialog" aria-modal="true" aria-labelledby="tb-title"><div class="sx-modal__scrim" data-act="closeModal"></div><div class="sx-modal__card cep-tb-modal" tabindex="-1"><button class="sx-x sx-x--lg cep-tb-x" data-act="closeModal" aria-label="Close dialog">✕</button>' +
      CEP.tbid({ ctx: "prospect", mode: s.gateMode === "create" ? "create" : "signin", email: s.me.email, err: err, purpose: "To " + (GATE_WHY[s.pendingGate] || "continue") + ", log in or sign up for free. Your estimate stays as it is." }) + "</div></div>";
    document.body.classList.add("sx-lock");
    var f = document.getElementById("tb-e"); if (f) f.focus();
  }
  A.tbMode = function (el) { if (el.getAttribute("data-ctx") === "prospect") { S().gateMode = el.getAttribute("data-v"); CEP.save(); drawGate(); } };
  A.gateMode = function (el) { S().gateMode = el.getAttribute("data-v"); CEP.save(); drawGate(); };
  A.gateSubmit = function () {
    var s = S(), em = (document.getElementById("tb-e") || {}).value || "", nm = (document.getElementById("tb-n") || {}).value || "";
    if (!/.+@.+\..+/.test(em.trim())) { drawGate("Enter a valid work email."); return; }
    s.me = { signedIn: true, email: em.trim(), name: nm }; var g = s.pendingGate; s.pendingGate = null;
    s.pub.saved = CEP.loadAccountSaves(s.me.email); // only this account's saved estimates
    CEP.track("login_state_selected", { role: "prospect", mode: s.gateMode, for: g }); CEP.save(); CEP.closeModal();
    if (g && GATES[g]) GATES[g](); else CEP.render();
  };

  A.meOut = function () { CEP.save(); S().me = { signedIn: false, email: "", name: "" }; S().pub.saved = []; CEP.save(); CEP.render(); };
  function sect(t) { return '<tr class="is-strong"><th scope="rowgroup" colspan="3">' + esc(t) + "</th></tr>"; }
  function lineRow(l) {
    var det = l.note ? "<small>" + esc(l.note) + "</small>" : "";
    var q = l.qty ? E.num(l.qty) + " " + esc(l.unitLabel || "") + (l.unitPrice ? "<small>" + (l.cat === "consumption" ? E.money(l.unitPrice) + " per " + esc(l.unit) : CEP.pu(l.unitPrice, l.unit)) + "</small>" : "") : "—";
    return '<tr><th scope="row">' + esc(l.label) + " " + (l.status !== "illustrative" ? CEP.status(l.status) : "") + det + "</th><td>" + q + "</td><td>" + CEP.amt(l) + "</td></tr>";
  }
  function relevantModules(edId) {
    var s = S(), out = [], seen = {};
    s.ctx.goals.forEach(function (gid) { var g = E.goal(gid); g.fix.forEach(function (mid) { if (!seen[mid]) { seen[mid] = 1; var m = E.mod(mid); out.push(Object.assign({}, m, { goalName: g.name })); } }); });
    Object.keys(s.pub.accepted).forEach(function (mid) { if (!seen[mid]) { seen[mid] = 1; out.push(E.mod(mid)); } });
    if (E.edRank(edId) >= 2 && !seen.afaddon && s.ctx.goals.indexOf("g_ai") < 0 && !s.ctx.goals.length) { out.push(E.mod("afaddon")); }
    return out;
  }
  A.chooseEdHere = function (el) { A.chooseEd(el); };
  A.toggleMod = function (el) {
    var id = el.getAttribute("data-id"), s = S(), m = E.mod(id);
    if (!CEP.modOk(m, s.pub.ed)) return;
    if (s.pub.accepted[id] !== undefined) { delete s.pub.accepted[id]; s.pub.declined[id] = true; CEP.track("sku_selected", { module: id, included: false }); }
    else { s.pub.accepted[id] = E.defaultQty(id, CEP.sel().seats); delete s.pub.declined[id]; CEP.track("sku_selected", { module: id, included: true }); }
    CEP.save(); CEP.render();
  };
  I.modQty = function (el) { S().pub.accepted[el.getAttribute("data-id")] = Math.max(1, Math.floor(+el.value || 1)); CEP.track("price_assumptions_changed", { module: el.getAttribute("data-id") }); CEP.save(); CEP.render(); };
  I.actions = function (el) { S().pub.actions = Math.max(0, Math.floor(+el.value || 0)); CEP.track("price_assumptions_changed", { actions: S().pub.actions }); CEP.save(); CEP.render(); };
  A.model = function (el) {
    var id = el.getAttribute("data-id"), chk = E.buyingModelCheck(id, S().pub.ed, S().pub.accepted, true);
    if (!chk.ok) { CEP.modal("Not available with this plan", "<p>" + esc(chk.reasons.join(" ")) + "</p><p class=\"sx-sub\">Alternative: <strong>" + esc(chk.alternative) + "</strong>. No discount is applied by switching models.</p><button class=\"sf-cta sf-cta--primary sf-cta--medium\" data-act=\"closeModal\">OK</button>"); return; }
    S().pub.model = id; CEP.track("price_assumptions_changed", { model: id }); CEP.save(); CEP.render();
  };
  A.next = function (el) { S().pub.next = el.getAttribute("data-v"); CEP.track("next_step_selected", { next: S().pub.next }); CEP.save(); location.hash = el.getAttribute("href"); };
  A.buyOnline = function () {
    CEP.track("next_step_selected", { next: "buy" });
    CEP.modal("Online checkout isn’t part of this prototype", "<p>In production, " + esc(E.ed(S().pub.ed).name) + " could be bought online. This research prototype doesn’t collect payment or create orders.</p><p class=\"sx-sub\">Your estimate is saved. You can start a trial or talk to Sales instead.</p><div class=\"sx-btnrow\"><a class=\"sf-cta sf-cta--primary sf-cta--medium\" href=\"#/try\" data-act=\"closeGo\">Start a trial</a><button class=\"sf-cta sf-cta--secondary sf-cta--medium\" data-act=\"closeModal\">Back to estimate</button></div>");
  };
  A.closeGo = function (el) { CEP.closeModal(); location.hash = el.getAttribute("href"); };

  /* ═════════ SAVE / COMPARE SCENARIOS (R15) ═════════ */
  A.saveScenario = function () {
    var s = S(); if (s.pub.saved.length >= 3) { CEP.toast("You can keep 3 versions. Delete one on the compare page."); return; }
    var name = "Version " + String.fromCharCode(65 + s.pub.saved.length);
    s.pub.saved.push({ name: name, at: new Date().toISOString(), sel: JSON.parse(JSON.stringify(CEP.sel())) });
    CEP.track("saved_mock", { name: name }); CEP.save(); CEP.toast(name + " saved to your account (simulated)"); CEP.render();
  };
  R["/compare"] = function () {
    var s = S();
    if (!s.me.signedIn) return CEP.page('<h1 class="sx-h2">Compare saved versions</h1><p class="sx-sub">Sign in or create an account to see and compare your saved estimates.</p><div class="sx-btnrow"><button class="sf-cta sf-cta--primary sf-cta--medium" data-act="gate" data-g="compare">Sign in or create account</button></div>' + stepNav("#/next", "Back", null, null), { rail: true });
    if (CEP.isEnt()) return CEP.page('<h1 class="sx-h2">Compare saved versions</h1>' + CEP.note("", "Saved estimates aren’t used for 1,000+ employees, because a specialist prepares your pricing. <a href=\"#/recommend\">Compare options side by side</a> or <a href=\"#/handoff\">talk to Sales</a>."), { rail: true });
    var h = '<h1 class="sx-h2">Compare saved versions</h1><p class="sx-sub">The same details as the side-by-side option comparison, for each version you saved. Restoring one doesn’t change the others.</p>';
    if (!s.pub.saved.length) return CEP.page(h + CEP.note("", "No saved versions yet. Save one from the <a href=\"#/next\">Next steps</a> page.") + stepNav("#/next", "Back", null, null), { rail: true });
    var vs = s.pub.saved, ests = vs.map(function (v) { return E.estimate(v.sel); });
    var goals = []; vs.forEach(function (v) { (v.sel.goals || []).forEach(function (g) { if (goals.indexOf(g) < 0) goals.push(g); }); });
    var rows = [];
    function add(label, cells, opts) { rows.push({ label: label, cells: cells, opts: opts || {} }); }
    add("Edition", ests.map(function (e) { return "<strong>" + esc(e.edition.name) + "</strong>"; }));
    add("Price", ests.map(function (e, i) { return e.priceable ? "<strong>" + CEP.pu(e.edition.price, "user/mo") + "</strong><small>" + CEP.pt(e.lines[0].amount) + " for " + vs[i].sel.seats + " users</small>" : "Priced by Sales"; }));
    add("Users", vs.map(function (v) { return String(v.sel.seats); }));
    goals.forEach(function (gid) {
      add(E.goal(gid).name, vs.map(function (v) {
        if ((v.sel.goals || []).indexOf(gid) < 0) return '<span class="sx-na">Not a goal in this version</span>';
        var r = E.coverGoal(gid, v.sel.ed, v.sel.accepted);
        var by = r.closedBy ? "<small>With " + esc(E.mod(r.closedBy).name) + "</small>" : (r.fixes.length ? "<small>Needs " + r.fixes.map(function (f) { return esc(E.mod(f).name); }).join(", ") + " (not included)</small>" : (r.needsUpgrade ? "<small>Needs a higher edition</small>" : ""));
        return '<span class="sx-lv">' + (r.status === "full" ? CEP.ic.check + " Covered" : r.status === "partial" ? CEP.ic.part + " Partly" : CEP.ic.gap + " Not covered") + "</span>" + by;
      }), { goal: true });
    });
    add("Add-ons", ests.map(function (e) { var l = e.lines.filter(function (x) { return x.id !== "ed" && x.cat === "software"; }); return l.length ? l.map(function (x) { return esc(x.label) + (x.included ? " <small>Included</small>" : x.incompatible ? " <small>Not compatible</small>" : x.amount === null ? " <small>Not priced</small>" : ""); }).join("<br>") : '<span class="sx-na">None</span>'; }));
    add("Flex Credits included", ests.map(function (e) { return e.edition.credits ? E.credits(e.edition.credits) + "/org/yr" : '<span class="sx-na">None</span>'; }));
    add("AI usage", ests.map(function (e, i) { var a = vs[i].sel.actions || 0; if (!a) return '<span class="sx-na">None entered</span>'; if (!e.credits) return E.num(a) + " actions/mo <small>Not available on this edition</small>"; return E.num(a) + " actions/mo<small>" + (e.credits.packs ? E.credits(e.credits.incremental) + " beyond included credits" : "Covered by included credits") + "</small>"; }));
    add("Slack", ests.map(function (e) { return esc(e.edition.slack); }));
    add("Billing", vs.map(function (v, i) { var e = ests[i].edition; return e.billing.indexOf("monthly") >= 0 && v.sel.billing === "monthly" ? "Monthly" : "Annual contract"; }));
    add("Try first", ests.map(function (e) { return esc(trialFor(e.edition.id).name); }));
    add("Limitations", ests.map(function (e) { return "<small>" + e.edition.limits.map(esc).join("<br>") + "</small>"; }));
    add("Software " + CEP.sfx(), ests.map(function (e) { return e.priceable ? CEP.pt(e.softwareAnnual) : "—"; }), { money: true });
    add("Usage " + CEP.sfx(), ests.map(function (e) { return !e.credits ? "—" : (e.priceable ? (e.credits.packs ? CEP.pt(e.consumptionAnnual) : "Covered by included credits") : "—"); }), { money: true });
    add("Known total " + CEP.sfx(), ests.map(function (e) { return (e.priceable ? "<strong>" + CEP.pt(e.knownAnnual) + "</strong>" : "—") + (e.partial ? " <small>" + esc(CEP.partialWhy(e)) + "</small>" : ""); }), { total: true });
    add("Services (one-time, not in total)", ests.map(function (e) { return e.services.show ? E.money(e.services.band.low) + "–" + E.money(e.services.band.high) + " <small>" + esc(e.services.band.label) + " · synthetic</small>" : "Pending approval"; }));
    add("Not priced", ests.map(function (e) { return e.unknown.length ? e.unknown.map(esc).join(", ") : "—"; }));

    var diffOnly = !!s.pub.diffOnly;
    h += '<div class="cep-row-between">' + CEP.periodToggle("pt-cmp") + '<label class="sx-chk"><input type="checkbox" data-in="diffOnly"' + (diffOnly ? " checked" : "") + " /> Show only rows that differ</label></div>";
    h += '<div class="sx-tblw sx-mt" style="margin-top:12px"><table class="sx-tbl"><caption class="sx-vh">Saved version comparison</caption><thead><tr><th scope="col">Compare</th>' + vs.map(function (v) { return '<th scope="col">' + esc(v.name) + "<small>Saved " + new Date(v.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + "</small></th>"; }).join("") + "</tr></thead><tbody>";
    rows.forEach(function (r) {
      var same = r.cells.every(function (c) { return c === r.cells[0]; });
      if (diffOnly && same && r.label !== "Edition") return;
      h += "<tr" + (r.opts.total ? ' class="is-total"' : (!same && vs.length > 1 ? ' class="is-strong"' : "")) + '><th scope="row">' + esc(r.label) + "</th>" + r.cells.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    });
    h += '<tr><th scope="row"></th>' + vs.map(function (v, i) { return '<td><div class="sx-btnrow"><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="restore" data-i="' + i + '">Restore</button><button class="sx-link" data-act="delSaved" data-i="' + i + '">Delete</button></div></td>'; }).join("") + "</tr>";
    h += "</tbody></table></div>";
    h += '<p class="sx-fine">Highlighted rows differ between versions. Source: ' + esc(FX.meta.priceSource) + ". Illustrative list prices; services ranges are synthetic and never added to totals.</p>";
    CEP.track("option_compared", { saved: vs.length });
    return CEP.page(h + stepNav("#/next", "Back", null, null), { rail: true });
  };
  I.diffOnly = function (el) { S().pub.diffOnly = el.checked; CEP.save(); CEP.render(); };
  A.restore = function (el) { var v = S().pub.saved[+el.getAttribute("data-i")], p = S().pub; p.ed = v.sel.ed; p.seats = v.sel.seats; p.billing = v.sel.billing; p.accepted = JSON.parse(JSON.stringify(v.sel.accepted)); p.actions = v.sel.actions; CEP.save(); CEP.toast(v.name + " restored"); CEP.go("#/estimate"); };
  A.delSaved = function (el) { S().pub.saved.splice(+el.getAttribute("data-i"), 1); S().pub.saved.forEach(function (v, i) { v.name = "Version " + String.fromCharCode(65 + i); }); CEP.save(); CEP.render(); };

  CEP.summaryText = function () {
    var s = S(), est = CEP.est(), L = [];
    L.push("SALESFORCE PRICING ESTIMATE — ILLUSTRATIVE RESEARCH PROTOTYPE. NOT A QUOTE.");
    L.push("Generated " + new Date().toISOString().slice(0, 10) + " · session " + s.session);
    L.push("");
    L.push("Goals: " + (s.ctx.goals.map(function (g) { return E.goal(g).name; }).join("; ") || "none"));
    if (!est) { L.push("No option chosen."); return L.join("\n"); }
    if (CEP.isEnt()) { L.push("Option: " + est.edition.name); L.push("Pricing: tailored by Salesforce for 1,000+ employees. No estimate shown."); return L.join("\n"); }
    L.push("Edition: " + est.edition.name + " · " + CEP.sel().seats + " users");
    est.lines.forEach(function (l) { L.push(" - " + l.label + ": " + (l.included ? "Included" : l.incompatible ? "Excluded (not compatible)" : l.amount === null ? "Not priced" : (l.status === "from" ? "from " : "") + E.money(l.amount) + "/yr") + (l.note ? " (" + l.note + ")" : "")); });
    L.push((est.partial ? "Known subtotal (partial): " : "Estimated total: ") + (est.priceable ? E.money(est.monthly) + "/mo monthly equivalent · " + E.money(est.knownAnnual) + "/yr" : "not priced"));
    L.push("Included: " + est.included.join(", "));
    L.push("Services (one-time, not in total): " + (est.services.show ? E.money(est.services.band.low) + "–" + E.money(est.services.band.high) + " SYNTHETIC indicative range" : "pending approval"));
    L.push("Not included: " + est.services.excluded.join(", "));
    L.push(""); L.push("Assumptions:"); est.assumptions.forEach(function (a) { L.push(" - " + a); });
    return L.join("\n");
  };
  A.downloadSummary = function () {
    var ok = CEP.download("salesforce-estimate-ILLUSTRATIVE.txt", CEP.summaryText());
    CEP.toast(ok ? "Summary downloaded" : "Download failed — use Copy instead");
    if (!ok) { CEP.copy(CEP.summaryText()); }
  };

  /* ═════════ F4 TRY — real trials + industry use cases (no demos) ═════════ */
  function trialFor(edId) { return FX.trials[edId] || FX.trials.st; }
  function useCasesFor(indId) { return FX.useCases[indId] || FX.useCases.other; }
  R["/try"] = function () {
    var s = S(), e = s.pub.ed ? E.ed(s.pub.ed) : null, f = s.rs.failures, t = s.trial;
    var h = '<h1 class="sx-h2">Try before you decide</h1>';
    if (!e) return CEP.page(h + '<p class="sx-sub">Choose an option first so we can show the right trial.</p><a class="sf-cta sf-cta--primary sf-cta--medium" href="#/recommend">See options</a>', { rail: true, crumbs: CEP.crumbs(STEPS, 3) });
    var tr = trialFor(e.id), ind = FX.industries.filter(function (i) { return i.id === s.ctx.industry; })[0] || null;
    var ucs = useCasesFor(ind ? ind.id : "other");
    var uc = t.useCase ? ucs.filter(function (u) { return u.id === t.useCase; })[0] : null;

    if (t.state && uc) { // active trial journey
      h += '<p class="sx-sub">' + esc(tr.name) + " · use case: " + esc(uc.name) + "</p>";
      if (t.state === "handoff") h += CEP.note("", "<strong>Your " + esc(tr.product) + " trial opened in a new tab on salesforce.com.</strong> That’s the real trial signup. When your trial org is ready, come back here for the first steps. Your estimate is saved. <div><button class=\"sf-cta sf-cta--secondary sf-cta--medium\" data-act=\"trialBack\">I’m in my trial — show first steps</button></div>");
      if (t.state === "ready" || t.state === "done") {
        h += '<div class="sx-cb"><div class="cep-row-between"><h2 class="sx-h4" style="margin:0">' + esc(uc.name) + "</h2>" + CEP.status("live") + '</div><p class="sx-mod__d">Goal: ' + esc(uc.outcome) + ". Do these in your trial org and tick them off here.</p><ol class=\"cep-tasks\">" + uc.steps.map(function (x, i) {
          var done = t.tasks.indexOf(i) >= 0;
          return '<li class="' + (done ? "is-done" : "") + '"><label class="sx-chk"><input type="checkbox" data-in="task" data-i="' + i + '"' + (done ? " checked" : "") + " /> " + esc(x) + "</label></li>";
        }).join("") + "</ol>";
        if (t.state === "done") h += '<div class="sx-ok"><strong>Nice work.</strong> You’ve seen the first result for “' + esc(uc.outcome.toLowerCase()) + "”. Your trial keeps running for the rest of its 30 days.</div>";
        h += '<p class="sx-fine">Use-case starters are a prototype concept: the trial is real, the guided steps run on this page.</p></div>';
      }
      h += '<p class="sx-fine"><button class="sx-link" data-act="trialEnd">Pick a different use case</button></p>' + stepNav("#/next", "Back to next steps", null, null);
      return CEP.page(h, { rail: true, crumbs: CEP.crumbs(STEPS, 3) });
    }

    h += '<p class="sx-sub">Start a real 30-day trial of ' + esc(tr.product) + " on salesforce.com. Pick a use case for your industry and we’ll guide your first steps.</p>";
    var blocked = null;
    if (f.trialUnavailable) blocked = "The " + esc(tr.product) + " trial isn’t available right now. A specialist can set up a guided trial for you. Your estimate is kept.";
    if (f.trialExpired) blocked = "You’ve already used a " + esc(tr.product) + " trial with this email (simulated). A specialist can extend it or set up a new one. Your estimate is kept.";
    if (blocked) h += CEP.note("w", "<strong>Trial unavailable.</strong> " + blocked + ' <div><a class="sf-cta sf-cta--primary sf-cta--medium" href="#/handoff" data-act="next" data-v="sales" data-allow-disabled>Talk to Sales</a></div>');

    // trial details (R13)
    h += '<div class="cep-trial"><div class="cep-row-between"><h2 class="sx-h3" style="margin:0">' + esc(tr.name) + "</h2>" + CEP.status("live") + "</div>" +
      (tr.pageName ? '<p class="sx-fine">Opens the salesforce.com page “' + esc(tr.pageName) + "”.</p>" : "") +
      '<ul class="cep-kv cep-kv--2"><li><span>Length</span>' + esc(tr.duration) + "</li><li><span>Users</span>" + esc(tr.users) + "</li><li><span>What’s included</span>" + esc(tr.includes) + "</li><li><span>Sign-up</span>" + esc(tr.card) + "</li><li><span>Your data</span>" + esc(tr.data) + "</li><li><span>When it ends</span>" + esc(tr.ends) + ". Nothing is charged.</li><li><span>Afterwards</span>" + esc(tr.after) + "</li><li><span>Help</span>" + esc(tr.support) + "</li></ul>" +
      (tr.maxNote ? CEP.note("w", "There’s no public trial for Max. This opens the Advanced trial; ask Sales to see Max-only features.") : "") + "</div>";
    var salesOnly = e.id === "core" || e.id === "adv" || e.id === "max";
    var wantsService = salesOnly && (s.pub.accepted.svc !== undefined || s.ctx.goals.indexOf("g_service") >= 0);
    if (wantsService) h += CEP.note("", "<strong>Also try Service Cloud.</strong> Your plan includes customer service, which is a separate 30-day trial. <a href=\"" + FX.links.serviceTrial + "\" target=\"_blank\" rel=\"noopener noreferrer\" data-act=\"svcTrial\" data-allow-disabled>Open Service Cloud trial " + CEP.ic.ext + "</a>");
    if (ind && ind.industryTrial) h += CEP.note("", "<strong>" + esc(ind.industryTrial) + " trial org.</strong> Salesforce also offers a 30-day " + esc(ind.industryTrial) + " trial on its free-trials page (Industry-Based Trials tab). <a href=\"" + FX.links.industryTrials + "\" target=\"_blank\" rel=\"noopener noreferrer\">See industry trials " + CEP.ic.ext + "</a>");

    // industry use cases
    h += '<h2 class="sx-h3 sx-mt">Start with a use case' + (ind && ind.id !== "other" ? " for " + esc(ind.name) : "") + "</h2>";
    if (!ind || ind.id === "other") h += '<p class="sx-sub">' + (ind ? "" : "Tell us your industry to see use cases for it. ") + '<label class="sx-vh" for="tryind">Industry</label><select id="tryind" data-in="tryInd" style="max-width:320px"><option value="">Choose industry…</option>' + FX.industries.map(function (i) { return '<option value="' + i.id + '"' + (s.ctx.industry === i.id ? " selected" : "") + ">" + esc(i.name) + "</option>"; }).join("") + "</select></p>";
    h += '<div class="cep-try">' + ucs.map(function (u) {
      var score = function (x) { return x.goals.filter(function (g) { return s.ctx.goals.indexOf(g) >= 0; }).length; };
      var match = score(u) > 0, best = match && ucs.filter(function (x) { return score(x) > score(u); }).length === 0 && ucs.filter(function (x) { return score(x) === score(u); })[0] === u;
      return '<article class="cep-tryc' + (best ? " is-primary" : "") + '">' + (best ? '<span class="cep-common">Best match for your goals</span>' : match ? '<span class="cep-common">Matches your goals</span>' : "") + '<h3 class="sx-h4">' + esc(u.name) + '</h3><p class="sx-mod__d">' + esc(u.outcome) + '</p><details class="sx-det"><summary>First steps</summary><ol class="cep-steps">' + u.steps.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></details>" +
        '<button class="sf-cta sf-cta--' + (best ? "primary" : "secondary") + ' sf-cta--medium" data-act="startTrial" data-uc="' + u.id + '"' + (blocked ? ' aria-disabled="true"' : "") + ">Start this trial</button></article>";
    }).join("") + "</div>";
    h += '<div class="cep-custom"><div><h3 class="sx-h4" style="margin:0">Have your own use case?</h3><p class="sx-mod__d">A specialist can set up a trial around your process and data needs.</p></div><a class="sf-cta sf-cta--secondary sf-cta--medium" href="#/handoff" data-act="next" data-v="sales" data-allow-disabled>Talk to Sales</a></div>';
    h += '<p class="sx-fine">Trials are real salesforce.com trials. Use-case starters are a prototype concept for research.</p>';
    h += stepNav("#/next", "Back to next steps", null, null);
    return CEP.page(h, { rail: true, crumbs: CEP.crumbs(STEPS, 3) });
  };
  A.startTrial = function (el) {
    var s = S(), uc = el.getAttribute("data-uc"), tr = trialFor(s.pub.ed);
    if (!s.me.signedIn) { CEP.requireAccount("trial"); return; }
    s.trial.kind = "live"; s.trial.useCase = uc; s.trial.tasks = []; s.trial.state = "handoff";
    CEP.track("trial_started_mock", { edition: s.pub.ed, useCase: uc, industry: s.ctx.industry });
    try { window.open(FX.links[tr.link], "_blank", "noopener,noreferrer"); } catch (e) { /* */ }
    CEP.save(); CEP.render();
  };
  A.svcTrial = function (el) { CEP.track("trial_started_mock", { product: "service" }); try { window.open(el.getAttribute("href"), "_blank", "noopener,noreferrer"); } catch (e) { /* */ } };
  I.tryInd = function (el) { S().ctx.industry = el.value || null; CEP.track("context_changed", { field: "industry", value: el.value, via: "try" }); CEP.save(); CEP.render(); };
  A.trialBack = function () { S().trial.state = "ready"; CEP.save(); CEP.render(); };
  A.trialEnd = function () { var t = S().trial; t.state = null; t.kind = null; t.useCase = null; t.tasks = []; CEP.save(); CEP.render(); };
  I.task = function (el) {
    var t = S().trial, i = +el.getAttribute("data-i"), p = t.tasks.indexOf(i);
    if (el.checked && p < 0) t.tasks.push(i); if (!el.checked && p >= 0) t.tasks.splice(p, 1);
    if (t.tasks.length === 3) { t.state = "done"; CEP.track("trial_task_completed_mock", { useCase: t.useCase }); }
    else if (t.state === "done") t.state = "ready";
    CEP.save(); CEP.render();
  };

  /* ═════════ F8 SALES HANDOFF ═════════ */
  R["/handoff"] = function () {
    var s = S(), hd = s.hand, est = CEP.est();
    var back = s.pub.lastRoute || "#/estimate";
    var h = '<h1 class="sx-h2">Talk to Sales</h1><p class="sx-sub">Here is exactly what we would share with a Salesforce specialist. Untick anything you don’t want to share. Nothing is sent in this prototype.</p>';
    if (hd.sent) {
      h += '<div class="sx-ok" role="status"><strong>Request ready (simulated).</strong> In production a specialist would contact ' + esc(hd.email) + ". Nothing was transmitted from this prototype.</div>";
      h += '<div class="sx-btnrow sx-mt"><a class="sf-cta sf-cta--primary sf-cta--medium" href="' + back + '">Return to where I was</a><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="handReset">Edit request</button></div>';
      return CEP.page(h, { rail: true });
    }
    if (hd.declined) h += CEP.note("", "No problem — nothing will be shared. You can <button class=\"sx-link\" data-act=\"downloadSummary\">download</button> or <button class=\"sx-link\" data-act=\"copySummary\">copy</button> your summary instead, or <a href=\"" + back + "\">go back</a>.");
    var groups = [
      ["context", "Business context", [labelOf("industry"), labelOf("size"), labelOf("region")].filter(Boolean).join(" · ") || "None given"],
      ["goals", "Goals", s.ctx.goals.map(function (g) { return E.goal(g).name; }).join(", ") || "None selected"],
      ["products", "Selected products and quantities", est ? est.lines.map(function (l) { return l.label + (l.qty ? " × " + E.num(l.qty) + " " + (l.unitLabel || "").replace(/^× /, "") : ""); }).join(", ") : "None"],
      ["estimate", "Estimate and price status", CEP.isEnt() ? "No estimate shown. You’re asking for tailored pricing (1,000+ employees)." : est ? (est.priceable ? E.money(est.monthly) + "/mo (" + E.money(est.knownAnnual) + "/yr)" : "Not priced") + (est.partial ? " (partial)" : "") + " · illustrative list prices" : "No estimate"],
      ["assumptions", "Assumptions", est ? "Seats, usage input, billing, buying model" : "—"]
    ];
    h += '<div class="sx-share"><h2 class="sx-h4" style="margin-top:4px">What would be shared</h2><ul class="cep-sharelist">' + groups.map(function (g) {
      return '<li><label class="sx-chk"><input type="checkbox" data-in="handInc" data-k="' + g[0] + '"' + (hd.include[g[0]] ? " checked" : "") + " /> <strong>" + esc(g[1]) + '</strong></label><span class="sx-mod__d">' + esc(g[2]) + "</span></li>";
    }).join("") + '<li><span class="sx-mod__d">Also shared: the next step you chose (' + esc(s.pub.next || "talk to sales") + ") and your contact details below.</span></li></ul></div>";
    h += '<div class="sx-form"><div class="sx-grid2">' + field("hname", "Full name", hd.name, "text", hd.err && !hd.name, true) + field("hemail", "Work email", hd.email, "email", hd.err && !/.+@.+\..+/.test(hd.email), true) + "</div><div class=\"sx-grid2\">" + field("hcompany", "Company", hd.company, "text", false, false) + field("hphone", "Phone", hd.phone, "tel", hd.err && !(hd.phone && /\d/.test(hd.phone)), true) + "</div>" +
      '<label class="sx-chk"><input type="checkbox" id="hconsent" data-in="handConsent"' + (hd.consent ? " checked" : "") + " /> I agree to share the items above with Salesforce so a specialist can contact me (simulated consent).</label>" + (hd.err && !hd.consent ? '<p class="sx-err">Tick the consent box to continue, or choose “Don’t share”.</p>' : "") + "</div>";
    h += '<div class="sx-foot"><a class="sf-cta-back" href="' + back + '">Back</a><span class="sx-foot__n"></span><div class="sx-btnrow"><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="handDecline">Don’t share</button><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="copySummary">Copy summary</button><button class="sf-cta sf-cta--primary sf-cta--medium" data-act="handSend">Review and send (simulated)</button></div></div>';
    return CEP.page(h, { rail: true });
  };
  function labelOf(k) {
    var c = S().ctx;
    if (k === "industry" && c.industry) return FX.industries.filter(function (i) { return i.id === c.industry; })[0].name;
    if (k === "size" && c.size) return E.size(c.size).range;
    if (k === "region" && c.region) return E.region(c.region).name;
    return null;
  }
  function field(id, label, val, type, bad, req) {
    var err = id === "hemail" ? "Enter a valid work email." : (id === "hphone" ? "Enter a phone number." : "Enter your name.");
    var star = req ? ' <abbr class="cep-req" title="Required">*</abbr>' : "";
    return '<div><label class="sx-lbl" for="' + id + '">' + esc(label) + star + '</label><input id="' + id + '" type="' + type + '" value="' + esc(val) + '" data-in="hand" data-live="1" data-k="' + id.slice(1) + '"' + (req ? ' aria-required="true"' : "") + (bad ? ' aria-invalid="true" aria-describedby="' + id + '-e"' : "") + " />" + (bad ? '<p class="sx-err" id="' + id + '-e">' + err + "</p>" : "") + "</div>";
  }
  I.hand = function (el) { S().hand[el.getAttribute("data-k")] = el.value; CEP.save(); };
  I.handInc = function (el) { S().hand.include[el.getAttribute("data-k")] = el.checked; CEP.save(); };
  I.handConsent = function (el) { S().hand.consent = el.checked; CEP.save(); };
  A.handDecline = function () { S().hand.declined = true; S().hand.consent = false; CEP.track("sales_handoff_mock", { consent: false }); CEP.save(); CEP.render(); };
  A.handSend = function () {
    var hd = S().hand;
    ["name", "email", "company", "phone"].forEach(function (k) { var el = document.getElementById("h" + k); if (el) hd[k] = el.value; });
    var ok = hd.name && /.+@.+\..+/.test(hd.email) && hd.phone && /\d/.test(hd.phone) && hd.consent;
    if (!ok) { hd.err = true; CEP.save(); CEP.render(); var bad = document.querySelector('[aria-invalid="true"], #hconsent'); if (bad) bad.focus(); return; }
    hd.err = false; hd.sent = true; hd.declined = false;
    CEP.track("sales_handoff_mock", { consent: true, shared: Object.keys(hd.include).filter(function (k) { return hd.include[k]; }) });
    CEP.save(); CEP.render();
  };
  A.handReset = function () { S().hand.sent = false; CEP.save(); CEP.render(); };
  A.copySummary = function () { CEP.toast(CEP.copy(CEP.summaryText()) ? "Summary copied" : "Couldn’t copy — try Download"); };
})();
