/* ══════════════════════════════════════════════════════════════════
   flex-modal.js — shared Agentforce / Data 360 use-case modal
   Plain script (no ES module) so estimator/index.html can load it
   from disk. Both flavours share one shell; only the title + cards
   swap. openFlexModal(kind) is global for inline onclick in estimator.js.
   Agentforce and Data 360 Configure both open Step 2.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  var STEP1_SUB = "To estimate your Flex Credits, add your use cases and configure each one based on your business needs.";
  var STEP2_SUB = "Review this use case and adjust the volume inputs to estimate Flex Credits for your team. Totals update as you type.";

  var DEFAULT_USERS = 10;
  var DEFAULT_QUERIES = 45;
  var REF_CREDITS = 305200;
  var REF_PRICE = 1500;
  var REF_UNITS = DEFAULT_USERS * DEFAULT_QUERIES;

  var D360_DEFAULT_RUNS = 550;
  var D360_DEFAULT_METRICS = 25;
  var D360_REF_CREDITS = 1300;
  var D360_REF_PRICE = 6.3;
  var D360_REF_UNITS = D360_DEFAULT_RUNS * D360_DEFAULT_METRICS;

  var CATALOG = {
    af: {
      title: "Agentforce Agent Template",
      configureTitle: "Configure your Agent Template",
      chevron: true,
      cards: [
        { nm: "Service Agent", ds: "Elevate your customer support with Service Agent, delivering fast, personalized assistance that delights customers and boosts loyalty. Empower your team with AI-driven insights and seamless case management.", rec: true, emp: true },
        { nm: "Use Case Title", ds: LOREM, rec: true, emp: true },
        { nm: "Scheduling Agent", ds: "Optimize your field operations with Scheduling Agent, ensuring timely and efficient service delivery. Automate scheduling, dispatching, and resource allocation to maximize productivity.", rec: true, emp: true },
        { nm: "Commerce Merchant Agent", ds: "Transform your online store with Commerce Merchant Agent, delivering personalized shopping experiences that drive conversions. Manage your products and customer interactions effortlessly.", rec: true },
        { nm: "Commerce Shopper Agent", ds: "Supercharge your lead generation with Leadgen Agent, capturing high-quality leads effortlessly. Leverage powerful tools to nurture prospects and convert them into loyal customers.", emp: true },
        { nm: "Leadgen Agent", ds: "Supercharge your lead generation with Leadgen Agent, capturing high-quality leads effortlessly. Leverage powerful tools to nurture prospects and convert them into loyal customers.", cust: true },
        { nm: "Loan Product Assistance", ds: "Transform your online store with Commerce Merchant Agent, delivering personalized shopping experiences that drive conversions. Manage your products, orders, and customer interactions effortlessly." },
        { nm: "Mobile Worker", ds: "Simplify the loan process with Loan Product Assistance, offering personalized guidance every step of the way. Streamline applications, approvals, and management to enhance customer satisfaction.", emp: true },
        { nm: "Banking Employee Service Agent", ds: "Marketing description", emp: true }
      ]
    },
    d360: {
      title: "Data 360 Use Cases",
      configureTitle: "Configure your Use Case",
      chevron: false,
      cards: [
        { nm: "Automate Workflows for My Teams", ds: "Trigger and enrich your process automation workflows in real-time based on unified data changes to eliminate manual tasks and accelerate cross-functional business processes at scale" },
        { nm: "Real-Time Web Experiences", ds: "Deliver instant web personalization by adapting content based on real-time behavior. Enhance engagement and conversion rates with seamless, consistent experiences across every customer session" },
        { nm: "Segment & Target Audiences", ds: "With Data 360, marketers can build dynamic, high-value segments using unified customer data and AI-powered insights to deliver more personalized, cross-channel engagement" },
        { nm: "Surface a Unified View of my Customer", ds: "Unify fragmented data into a single, real-time customer profile. Empower your teams with a 360-degree view to deliver personalized engagement and consistent experiences across every touchpoint" },
        { nm: "Unified Reporting & Analytics", ds: "Transform fragmented data into a single source of truth and empower every user to turn trusted data into actionable insights and accurate reports across your entire ecosystem" }
      ]
    }
  };

  var state = {
    open: false,
    trigger: null,
    kind: null,
    step: 1,
    cardId: null,
    users: DEFAULT_USERS,
    queries: DEFAULT_QUERIES,
    runs: D360_DEFAULT_RUNS,
    metrics: D360_DEFAULT_METRICS,
    sectionOpen: true
  };

  var BOWL = "";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardId(card) {
    return String(card.nm).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function findCard(id) {
    var data = CATALOG[state.kind];
    if (!data) return null;
    for (var i = 0; i < data.cards.length; i++) {
      if (cardId(data.cards[i]) === id) return data.cards[i];
    }
    return null;
  }

  function flexStoreKey() {
    return state.kind === "d360" ? "d360Flex" : "afFlex";
  }

  function savedCase(id) {
    if (typeof S === "undefined") return null;
    var store = S[flexStoreKey()];
    if (!store || !store.cases) return null;
    return store.cases[id] || null;
  }

  function badges(card) {
    var h = "";
    if (card.rec) h += "<span class='flex-modal__badge flex-modal__badge--rec'><span class='flex-modal__badge-plus' aria-hidden='true'>+</span> Recommended</span>";
    if (card.emp) h += "<span class='flex-modal__badge flex-modal__badge--emp'>Employee Facing</span>";
    if (card.cust) h += "<span class='flex-modal__badge flex-modal__badge--cust'>Customer Facing</span>";
    return h;
  }

  function cardHtml(card, withChevron) {
    var id = cardId(card);
    var saved = savedCase(id);
    var cta;
    if (saved) {
      cta = "<button type='button' class='sf-cta sf-cta--secondary sf-cta--medium' data-flex-action='configure' data-card-id='" + esc(id) + "' aria-label='Edit " + esc(card.nm) + "'>Edit</button>";
    } else {
      cta = "<button type='button' class='sf-cta sf-cta--primary sf-cta--medium' data-flex-action='configure' data-card-id='" + esc(id) + "' aria-label='Configure " + esc(card.nm) + "'>Configure</button>";
    }
    return "<article class='flex-modal__card' role='listitem' data-card-id='" + esc(id) + "'>"
      + (withChevron ? "<i class='icon icon--chevrondown flex-modal__card-chevron' aria-hidden='true'></i>" : "")
      + "<div class='flex-modal__card-body'>"
      + "<div class='flex-modal__card-top'>"
      + "<h3 class='flex-modal__card-nm'>" + esc(card.nm) + "</h3>"
      + badges(card)
      + "</div>"
      + "<p class='flex-modal__card-ds'>" + esc(card.ds) + "</p>"
      + "</div>"
      + cta
      + "</article>";
  }

  function compute() {
    if (state.kind === "d360") {
      var runs = Math.max(0, Number(state.runs) || 0);
      var metrics = Math.max(0, Number(state.metrics) || 0);
      var dUnits = runs * metrics;
      return {
        credits: Math.round(dUnits * (D360_REF_CREDITS / D360_REF_UNITS)),
        price: dUnits * (D360_REF_PRICE / D360_REF_UNITS)
      };
    }
    var u = Math.max(0, Number(state.users) || 0);
    var q = Math.max(0, Number(state.queries) || 0);
    var units = u * q;
    return {
      credits: Math.round(units * (REF_CREDITS / REF_UNITS)),
      price: units * (REF_PRICE / REF_UNITS)
    };
  }

  function fmtCompact(n) {
    if (!n) return "0";
    if (Math.abs(n) >= 1000) {
      var k = Math.round((n / 1000) * 10) / 10;
      var s = k.toFixed(1);
      if (s.slice(-2) === ".0") s = s.slice(0, -2);
      return s + "k";
    }
    var r = Math.round(n * 10) / 10;
    if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
    return r.toFixed(1);
  }

  function fmtPriceDisp(n) {
    return "$ " + fmtCompact(n);
  }

  function metricPair(credits, price, tone) {
    return "<div class='flex-cfg__metrics flex-cfg__metrics--" + tone + "'>"
      + "<div class='flex-cfg__metric'><div class='flex-cfg__metric-v' data-flex-credits>" + esc(fmtCompact(credits)) + "</div><div class='flex-cfg__metric-l'>Credits</div></div>"
      + "<div class='flex-cfg__metric'><div class='flex-cfg__metric-v' data-flex-price>" + esc(fmtPriceDisp(price)) + "</div><div class='flex-cfg__metric-l'>Pricing</div></div>"
      + "</div>";
  }

  function stepsHtml() {
    var on1 = state.step !== 2;
    return "<span class='" + (on1 ? "flex-modal__steps-on" : "flex-modal__steps-off") + "'>1. Add Use Case</span>"
      + "<i class='icon icon--chevronright flex-modal__steps-sep' aria-hidden='true'></i>"
      + "<span class='" + (on1 ? "flex-modal__steps-off" : "flex-modal__steps-on") + "'>2. Configure</span>";
  }

  function listHtml() {
    var data = CATALOG[state.kind];
    if (!data) return "";
    return "<div class='flex-modal__list' id='flex-modal-list' role='list'>"
      + data.cards.map(function (c) { return cardHtml(c, data.chevron); }).join("")
      + "</div>";
  }

  function afFieldsHtml(m, open) {
    return "<button type='button' class='flex-cfg__section' data-flex-action='toggle-section' aria-expanded='" + (open ? "true" : "false") + "'>"
      + "<i class='icon icon--chevrondown flex-cfg__section-chevron" + (open ? " is-open" : "") + "' aria-hidden='true'></i>"
      + "<span class='flex-cfg__section-title'>Global Search Queries</span>"
      + metricPair(m.credits, m.price, "on-surface")
      + "</button>"
      + "<div class='flex-cfg__fields'" + (open ? "" : " hidden") + ">"
      + "<div class='flex-cfg__row'>"
      + "<label class='flex-cfg__label' for='flex-cfg-users'>How many users do you want to enable Agentforce Coworker for?</label>"
      + "<input class='flex-cfg__input' id='flex-cfg-users' type='number' min='0' step='1' value='" + esc(state.users) + "' data-flex-field='users' aria-label='Number of users'>"
      + "</div>"
      + "<div class='flex-cfg__row'>"
      + "<label class='flex-cfg__label' for='flex-cfg-queries'>How many Global Search Queries does an average user do per month? Assume 20 working days per month</label>"
      + "<input class='flex-cfg__input' id='flex-cfg-queries' type='number' min='0' step='1' value='" + esc(state.queries) + "' data-flex-field='queries' aria-label='Global Search Queries per user per month'>"
      + "</div>"
      + "</div>";
  }

  function d360FieldsHtml() {
    return "<div class='flex-cfg__fields'>"
      + "<div class='flex-cfg__row'>"
      + "<label class='flex-cfg__label' for='flex-cfg-runs'>On average, how many times per day would such a workflow run?</label>"
      + "<input class='flex-cfg__input' id='flex-cfg-runs' type='number' min='0' step='1' value='" + esc(state.runs) + "' data-flex-field='runs' aria-label='Workflow runs per day'>"
      + "</div>"
      + "<div class='flex-cfg__row'>"
      + "<div class='flex-cfg__copy'>"
      + "<label class='flex-cfg__label' for='flex-cfg-metrics'>How many calculated metrics will your automations require?</label>"
      + "<p class='flex-cfg__hint'>Automation flows can incorporate calculated metrics that you define in Data 360. For example, a customer satisfaction score has fallen by 30%, automatically triggering outreach.</p>"
      + "</div>"
      + "<input class='flex-cfg__input' id='flex-cfg-metrics' type='number' min='0' step='1' value='" + esc(state.metrics) + "' data-flex-field='metrics' aria-label='Calculated metrics required'>"
      + "</div>"
      + "</div>";
  }

  function configureHtml() {
    var card = findCard(state.cardId);
    if (!card) return "";
    var m = compute();
    var open = state.sectionOpen !== false;
    var emp = card.emp
      ? "<span class='flex-modal__badge flex-modal__badge--emp'>Employee Facing</span>"
      : (card.cust ? "<span class='flex-modal__badge flex-modal__badge--cust'>Customer Facing</span>" : "");
    var bodyClass = state.kind === "d360" ? "flex-cfg__body flex-cfg__body--plain" : "flex-cfg__body";
    var fields = state.kind === "d360" ? d360FieldsHtml() : afFieldsHtml(m, open);
    return "<div class='flex-cfg'>"
      + "<article class='flex-cfg__card'>"
      + "<header class='flex-cfg__head'>"
      + "<div class='flex-cfg__head-l'>"
      + "<div class='flex-cfg__name-row'><h3 class='flex-cfg__name'>" + esc(card.nm) + "</h3>" + emp + "</div>"
      + "<p class='flex-cfg__caption'>Calculation for the first year</p>"
      + "</div>"
      + metricPair(m.credits, m.price, "on-fill")
      + "</header>"
      + "<div class='" + bodyClass + "'>"
      + fields
      + "</div>"
      + "<footer class='flex-cfg__foot'>"
      + "<div class='flex-cfg__total'>Total</div>"
      + metricPair(m.credits, m.price, "on-fill")
      + "</footer>"
      + "</article>"
      + "<div class='flex-cfg__actions'>"
      + "<button type='button' class='flex-cfg__text-link' data-flex-action='another'>Configure another Use Case</button>"
      + "<button type='button' class='sf-cta sf-cta--primary sf-cta--medium' data-flex-action='add'>Add to Estimate</button>"
      + "</div>"
      + "</div>";
  }

  function paintChrome() {
    var data = CATALOG[state.kind];
    if (!data) return;
    var dialog = document.getElementById("flex-modal");
    var title = document.getElementById("flex-modal-title");
    var steps = document.getElementById("flex-modal-steps");
    var sub = document.getElementById("flex-modal-sub");
    var configuring = state.step === 2;
    if (dialog) {
      if (configuring) dialog.classList.add("flex-modal--configure");
      else dialog.classList.remove("flex-modal--configure");
    }
    if (title) title.textContent = configuring ? data.configureTitle : data.title;
    if (steps) steps.innerHTML = stepsHtml();
    if (sub) {
      sub.removeAttribute("hidden");
      sub.textContent = configuring ? STEP2_SUB : STEP1_SUB;
    }
  }

  function renderStage() {
    var stage = document.getElementById("flex-modal-stage");
    if (!stage) return;
    paintChrome();
    if (state.step === 2) {
      stage.innerHTML = configureHtml();
    } else {
      stage.innerHTML = listHtml();
    }
    stage.scrollTop = 0;
  }

  function refreshCfgMetrics() {
    var m = compute();
    var cred = fmtCompact(m.credits);
    var price = fmtPriceDisp(m.price);
    var creds = document.querySelectorAll("#flex-modal-stage [data-flex-credits]");
    var prices = document.querySelectorAll("#flex-modal-stage [data-flex-price]");
    for (var i = 0; i < creds.length; i++) creds[i].textContent = cred;
    for (var j = 0; j < prices.length; j++) prices[j].textContent = price;
  }

  function showStep1() {
    state.step = 1;
    state.cardId = null;
    state.sectionOpen = true;
    renderStage();
  }

  function showStep2(id) {
    var card = findCard(id);
    if (!card) return;
    var saved = savedCase(id);
    state.step = 2;
    state.cardId = id;
    if (state.kind === "d360") {
      state.runs = saved ? saved.runs : D360_DEFAULT_RUNS;
      state.metrics = saved ? saved.metrics : D360_DEFAULT_METRICS;
    } else {
      state.users = saved ? saved.users : DEFAULT_USERS;
      state.queries = saved ? saved.queries : DEFAULT_QUERIES;
    }
    state.sectionOpen = true;
    renderStage();
    var input = document.getElementById(state.kind === "d360" ? "flex-cfg-runs" : "flex-cfg-users");
    if (input) input.focus();
  }

  function persistCase() {
    if (typeof S === "undefined" || !state.cardId) return;
    var m = compute();
    var key = flexStoreKey();
    if (!S[key]) S[key] = { cases: {} };
    if (!S[key].cases) S[key].cases = {};
    var card = findCard(state.cardId);
    var rec = {
      nm: card ? card.nm : state.cardId,
      credits: m.credits,
      price: Math.round(m.price * 10) / 10
    };
    if (state.kind === "d360") {
      rec.runs = Number(state.runs) || 0;
      rec.metrics = Number(state.metrics) || 0;
    } else {
      rec.users = Number(state.users) || 0;
      rec.queries = Number(state.queries) || 0;
      rec.price = Math.round(m.price);
    }
    S[key].cases[state.cardId] = rec;
  }

  function onRootClick(e) {
    var t = e.target.closest("[data-flex-action]");
    if (!t || !state.open) return;
    var act = t.getAttribute("data-flex-action");
    if (act === "configure") {
      e.preventDefault();
      showStep2(t.getAttribute("data-card-id"));
    } else if (act === "add") {
      e.preventDefault();
      persistCase();
      closeFlexModal();
    } else if (act === "another") {
      e.preventDefault();
      showStep1();
    } else if (act === "toggle-section") {
      e.preventDefault();
      state.sectionOpen = !state.sectionOpen;
      var fields = document.querySelector(".flex-cfg__fields");
      var chev = t.querySelector(".flex-cfg__section-chevron");
      t.setAttribute("aria-expanded", state.sectionOpen ? "true" : "false");
      if (fields) {
        if (state.sectionOpen) fields.removeAttribute("hidden");
        else fields.setAttribute("hidden", "");
      }
      if (chev) chev.classList.toggle("is-open", state.sectionOpen);
    }
  }

  function onRootInput(e) {
    var field = e.target.getAttribute("data-flex-field");
    if (!field) return;
    var n = e.target.value === "" ? 0 : Number(e.target.value);
    if (!isFinite(n) || n < 0) n = 0;
    state[field] = n;
    refreshCfgMetrics();
  }

  function focusables() {
    var dialog = document.getElementById("flex-modal");
    if (!dialog) return [];
    return [].slice.call(dialog.querySelectorAll(
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )).filter(function (el) { return !el.hidden && !el.closest("[hidden]"); });
  }

  function onKey(e) {
    if (!state.open) return;
    if (e.key === "Escape") { e.preventDefault(); closeFlexModal(); return; }
    if (e.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function ensure() {
    if (document.getElementById("flex-modal-root")) return;
    var root = document.createElement("div");
    root.id = "flex-modal-root";
    root.className = "flex-modal-root";
    root.hidden = true;
    root.innerHTML = ""
      + "<div class='flex-modal__scrim' id='flex-modal-scrim'></div>"
      + "<div class='flex-modal' id='flex-modal' role='dialog' aria-modal='true' aria-labelledby='flex-modal-title' tabindex='-1'>"
      + "<div class='flex-modal__bowl' aria-hidden='true'>" + BOWL + "</div>"
      + "<button type='button' class='flex-modal__close' id='flex-modal-close' aria-label='Close'>"
      + "<i class='icon icon--close' aria-hidden='true'></i></button>"
      + "<header class='flex-modal__head'>"
      + "<h2 class='flex-modal__title' id='flex-modal-title'></h2>"
      + "<div class='flex-modal__steps' id='flex-modal-steps' aria-label='Use-case steps'></div>"
      + "<p class='flex-modal__sub' id='flex-modal-sub'>To estimate your Flex Credits, add your use cases and configure each one based on your business needs.</p>"
      + "</header>"
      + "<div class='flex-modal__main'>"
      + "<div class='flex-modal__stage' id='flex-modal-stage'></div>"
      + "</div>"
      + "</div>";
    document.body.appendChild(root);
    document.getElementById("flex-modal-scrim").addEventListener("click", function () { closeFlexModal(); });
    document.getElementById("flex-modal-close").addEventListener("click", function () { closeFlexModal(); });
    root.addEventListener("click", onRootClick);
    root.addEventListener("input", onRootInput);
  }

  function openFlexModal(kind, trigger, cardId) {
    var data = CATALOG[kind];
    if (!data) return;
    ensure();
    if (state.open) closeFlexModal(true);
    state.kind = kind;
    state.step = 1;
    state.cardId = null;
    state.sectionOpen = true;
    state.trigger = trigger || document.activeElement;
    state.open = true;
    if (cardId) showStep2(cardId);
    else renderStage();
    var root = document.getElementById("flex-modal-root");
    root.hidden = false;
    document.body.classList.add("flex-modal-open");
    document.addEventListener("keydown", onKey);
    var focusEl = document.getElementById("flex-cfg-users")
      || document.getElementById("flex-cfg-runs")
      || document.getElementById("flex-modal-close");
    if (focusEl) focusEl.focus();
  }

  function closeFlexModal(silent) {
    if (!state.open) return;
    var trigger = state.trigger;
    var kind = state.kind;
    state.open = false;
    state.kind = null;
    state.trigger = null;
    state.step = 1;
    state.cardId = null;
    var root = document.getElementById("flex-modal-root");
    if (root) root.hidden = true;
    document.body.classList.remove("flex-modal-open");
    document.removeEventListener("keydown", onKey);
    if (typeof syncFlexProductCard === "function") syncFlexProductCard();
    var focusEl = trigger;
    if (!focusEl || typeof focusEl.focus !== "function" || (focusEl.isConnected === false)) {
      var sel = kind === "d360"
        ? ".pc.on .pc-flex-cta button[onclick*=\"d360\"]"
        : ".pc.on .pc-flex-cta button[onclick*=\"af\"]";
      focusEl = document.querySelector(sel) || document.querySelector(".pc.on .pc-flex-cta button");
    }
    if (focusEl && silent !== true && typeof focusEl.focus === "function") focusEl.focus();
  }

  window.openFlexModal = function (kind, trigger, cardId) { openFlexModal(kind, trigger, cardId); };
  window.closeFlexModal = function () { closeFlexModal(); };
})();
