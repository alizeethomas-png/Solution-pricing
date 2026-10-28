/* ══════════════════════════════════════════════════════════════════
   flex-modal.js — shared Agentforce / Data 360 use-case modal
   Plain script (no ES module) so estimator/index.html can load it
   from disk. Both flavours share one shell; only the title + cards
   swap. openFlexModal(kind) is global for inline onclick in estimator.js.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  var CATALOG = {
    af: {
      title: "Agentforce Agent Template",
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
      chevron: false,
      cards: [
        { nm: "Segment & Target Audiences", ds: LOREM, rec: true },
        { nm: "Surface a Unified view of my Customer", ds: LOREM, rec: true },
        { nm: "Unified Reporting & Analytics", ds: LOREM },
        { nm: "Automate Workflows for my teams", ds: LOREM },
        { nm: "Power AI search experiences", ds: LOREM },
        { nm: "Power Sub-second Real Time Web experiences", ds: LOREM }
      ]
    }
  };

  var state = { open: false, trigger: null, kind: null, q: "" };

  var BOWL = '<svg viewBox="0 0 1152 1068" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
    + '<path fill="currentColor" d="M1152 50C1152 22.3859 1129.61 0 1102 0H50C22.3858 0 0 22.3857 0 50V1011.9C0 1044.13 30.0689 1067.9 61.6598 1061.5C243.964 1024.54 393.311 1020.98 571.341 1020.98C749.502 1020.98 910.291 1029.76 1091.61 1063.12C1122.82 1068.87 1152 1045.19 1152 1013.46V50Z"/>'
    + "</svg>";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function badges(card) {
    var h = "";
    if (card.rec) h += "<span class='flex-modal__badge flex-modal__badge--rec'><span class='flex-modal__badge-plus' aria-hidden='true'>+</span> Recommended</span>";
    if (card.emp) h += "<span class='flex-modal__badge flex-modal__badge--emp'>Employee Facing</span>";
    if (card.cust) h += "<span class='flex-modal__badge flex-modal__badge--cust'>Customer Facing</span>";
    return h;
  }

  function cardHtml(card, withChevron) {
    return "<article class='flex-modal__card' role='listitem'>"
      + (withChevron ? "<i class='icon icon--chevrondown flex-modal__card-chevron' aria-hidden='true'></i>" : "")
      + "<div class='flex-modal__card-body'>"
      + "<div class='flex-modal__card-top'>"
      + "<h3 class='flex-modal__card-nm'>" + esc(card.nm) + "</h3>"
      + badges(card)
      + "</div>"
      + "<p class='flex-modal__card-ds'>" + esc(card.ds) + "</p>"
      + "</div>"
      + "<button type='button' class='sf-cta sf-cta--primary sf-cta--medium' aria-label='Configure "+esc(card.nm)+"'>Configure</button>"
      + "</article>";
  }

  function renderList() {
    var data = CATALOG[state.kind];
    if (!data) return;
    var q = (state.q || "").toLowerCase();
    var list = document.getElementById("flex-modal-list");
    var cards = data.cards.filter(function (c) {
      return !q || c.nm.toLowerCase().indexOf(q) >= 0;
    });
    if (!cards.length) {
      list.innerHTML = "<p class='flex-modal__empty'>No use cases match that search.</p>";
      return;
    }
    list.innerHTML = cards.map(function (c) { return cardHtml(c, data.chevron); }).join("");
  }

  function focusables() {
    var dialog = document.getElementById("flex-modal");
    if (!dialog) return [];
    return [].slice.call(dialog.querySelectorAll(
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    ));
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
      + "<div class='flex-modal__steps' aria-label='Use-case steps'>"
      + "<span class='flex-modal__steps-on'>1. Add Use Case</span>"
      + "<i class='icon icon--chevronright flex-modal__steps-sep' aria-hidden='true'></i>"
      + "<span class='flex-modal__steps-off'>2. Configure</span>"
      + "</div>"
      + "<p class='flex-modal__sub'>To estimate your Flex Credits, add your use cases and configure each one based on your business needs.</p>"
      + "</header>"
      + "<div class='flex-modal__main'>"
      + "<aside class='flex-modal__aside'>"
      + "<label class='flex-modal__search'>"
      + "<i class='icon icon--search' aria-hidden='true'></i>"
      + "<input id='flex-modal-search' type='search' placeholder='Search template' autocomplete='off' aria-label='Search template'>"
      + "</label>"
      + "<p class='flex-modal__filter-label'>Filter by</p>"
      + "<button type='button' class='flex-modal__filter' aria-expanded='false'>Industry <i class='icon icon--chevrondown' aria-hidden='true'></i></button>"
      + "<button type='button' class='flex-modal__filter' aria-expanded='false'>Line of business <i class='icon icon--chevrondown' aria-hidden='true'></i></button>"
      + "</aside>"
      + "<div class='flex-modal__list' id='flex-modal-list' role='list'></div>"
      + "</div>"
      + "</div>";
    document.body.appendChild(root);
    document.getElementById("flex-modal-scrim").addEventListener("click", function () { closeFlexModal(); });
    document.getElementById("flex-modal-close").addEventListener("click", function () { closeFlexModal(); });
    document.getElementById("flex-modal-search").addEventListener("input", function (e) {
      state.q = e.target.value || "";
      renderList();
    });
  }

  function openFlexModal(kind, trigger) {
    var data = CATALOG[kind];
    if (!data) return;
    ensure();
    if (state.open) closeFlexModal(true);
    state.kind = kind;
    state.q = "";
    state.trigger = trigger || document.activeElement;
    state.open = true;
    document.getElementById("flex-modal-title").textContent = data.title;
    document.getElementById("flex-modal-search").value = "";
    renderList();
    var root = document.getElementById("flex-modal-root");
    root.hidden = false;
    document.body.classList.add("flex-modal-open");
    document.addEventListener("keydown", onKey);
    var list = document.getElementById("flex-modal-list");
    if (list) list.scrollTop = 0;
    document.getElementById("flex-modal-close").focus();
  }

  function closeFlexModal(silent) {
    if (!state.open) return;
    var trigger = state.trigger;
    state.open = false;
    state.kind = null;
    state.trigger = null;
    var root = document.getElementById("flex-modal-root");
    if (root) root.hidden = true;
    document.body.classList.remove("flex-modal-open");
    document.removeEventListener("keydown", onKey);
    if (trigger && silent !== true && typeof trigger.focus === "function") trigger.focus();
  }

  window.openFlexModal = function (kind, trigger) { openFlexModal(kind, trigger); };
  window.closeFlexModal = function () { closeFlexModal(); };
})();
