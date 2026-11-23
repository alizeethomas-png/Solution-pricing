/* ══════════════════════════════════════════════════════════════════
   nav.js — mobile navigation toggle
   ────────────────────────────────────────────────────────────────
   Progressive enhancement for the .sf-nav hamburger (shown ≤1023px).
   The nav renders and links work without this file; this only adds the
   open/close behaviour for the collapsed menu.

   Plain script (no ES module) so it runs when index.html is opened
   directly from disk (file://). When the prototype grows and is served
   over http, this can migrate to a `.mjs` module without markup changes.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var hamburger = document.querySelector(".sf-nav__hamburger");
  var links = document.querySelector(".sf-nav__links");
  if (!hamburger || !links) return;

  function setOpen(open) {
    links.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  hamburger.addEventListener("click", function () {
    setOpen(!links.classList.contains("is-open"));
  });

  // Close the menu after choosing a destination.
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // Close on Escape for keyboard users.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && links.classList.contains("is-open")) {
      setOpen(false);
      hamburger.focus();
    }
  });

  // Reset state if the viewport grows back to the desktop layout.
  var desktop = window.matchMedia("(min-width: 1024px)");
  desktop.addEventListener("change", function (e) {
    if (e.matches) setOpen(false);
  });
})();

/* ══════════════════════════════════════════════════════════════════
   Subnav dropdowns — click-toggle popover menus.
   Independent of the hamburger above; runs on every page that carries
   the pricing subnav and handles any number of .sf-subnav__dropdown
   menus (e.g. "Pricing By" and "Pricing Tools"). Opens on click, and
   opening one closes any other; closes on outside-click, Escape, or
   when a destination is chosen. State lives in aria-expanded on each
   toggle; the popover's visibility is driven from that in CSS.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var pairs = [].slice.call(document.querySelectorAll(".sf-subnav__dropdown"))
    .map(function (dropdown) {
      return { dropdown: dropdown, toggle: dropdown.querySelector(".sf-subnav__dropdown-toggle") };
    })
    .filter(function (pair) { return pair.toggle; });
  if (!pairs.length) return;

  function isOpen(toggle) {
    return toggle.getAttribute("aria-expanded") === "true";
  }
  function setOpen(toggle, open) {
    toggle.setAttribute("aria-expanded", String(open));
  }
  function closeAll(except) {
    pairs.forEach(function (pair) {
      if (pair.toggle !== except) setOpen(pair.toggle, false);
    });
  }

  pairs.forEach(function (pair) {
    // Toggle this menu; opening one closes any other that is open.
    pair.toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var open = !isOpen(pair.toggle);
      closeAll(pair.toggle);
      setOpen(pair.toggle, open);
    });

    // Choosing a destination closes this menu.
    pair.dropdown.addEventListener("click", function (e) {
      if (e.target.closest(".sf-subnav__menu-item")) setOpen(pair.toggle, false);
    });
  });

  // Close any open menu when clicking anywhere outside its dropdown.
  document.addEventListener("click", function (e) {
    pairs.forEach(function (pair) {
      if (isOpen(pair.toggle) && !pair.dropdown.contains(e.target)) setOpen(pair.toggle, false);
    });
  });

  // Close on Escape and return focus to the toggle of whichever menu was open.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    pairs.forEach(function (pair) {
      if (isOpen(pair.toggle)) {
        setOpen(pair.toggle, false);
        pair.toggle.focus();
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════════════════
   Ask Piper — floating CTA plus open / collapsed panels. State is
   kept in sessionStorage so it survives CEP hash navigation and
   other v3 page loads.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var KEY = "cep.piper.state";
  var MIC = '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><rect x="7.2" y="2.2" width="5.6" height="9.2" rx="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.8 10.2a5.2 5.2 0 0 0 10.4 0M10 15.4V18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var SEND = '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h10M11 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var EXT = '<svg class="piper-panel__ext" width="12" height="12" viewBox="0 0 20 20" aria-hidden="true"><path d="M11 3h6v6M17 3l-8 8M15 12v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MSG = "Salesforce offers flexible contract options and seamless integrations to fit your business needs. What would you like to explore about our pricing or integrations?";
  function salesHref() {
    return /\/cep(\/|$)/.test(location.pathname || "") ? "#/handoff" : "https://www.salesforce.com/company/contact-us/";
  }
  function loadState() {
    try {
      var s = sessionStorage.getItem(KEY);
      if (s === "open" || s === "collapsed" || s === "button") return s;
    } catch (e) { /* */ }
    return "button";
  }
  function saveState(s) {
    try { sessionStorage.setItem(KEY, s); } catch (e) { /* */ }
  }

  var btn = document.getElementById("ask-piper");
  if (!btn) {
    btn = document.createElement("a");
    btn.id = "ask-piper";
    btn.className = "sf-cta sf-cta--primary sf-cta--medium ask-piper";
    btn.href = "#";
    btn.innerHTML = "<i class='icon icon--sparkles' aria-hidden='true'></i> Ask Piper";
    document.body.appendChild(btn);
  }
  btn.setAttribute("aria-label", "Ask Piper");
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-controls", "piper-panel");

  var panel = document.getElementById("piper-panel");
  if (!panel) {
    panel = document.createElement("section");
    panel.id = "piper-panel";
    panel.className = "piper-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "piper-title");
    panel.hidden = true;
    panel.innerHTML =
      '<div class="piper-panel__head">' +
        '<div><h2 class="piper-panel__title" id="piper-title">Piper</h2><p class="piper-panel__role">AI SDR Agent</p></div>' +
        '<button type="button" class="piper-panel__close" aria-label="Collapse Piper"><i class="icon icon--close" aria-hidden="true"></i></button>' +
      "</div>" +
      '<div class="piper-panel__photo">' +
        '<button type="button" class="piper-panel__speak">' + MIC + '<span class="piper-panel__speak-lab">Speak with Piper</span></button>' +
      "</div>" +
      '<p class="piper-panel__msg">' + MSG + "</p>" +
      '<div class="piper-panel__grow"></div>' +
      '<a class="sf-cta sf-cta--secondary sf-cta--medium piper-panel__sales" href="' + salesHref() + '">Connect me with a sales rep</a>' +
      '<form class="piper-panel__ask" action="#">' +
        '<label class="sx-vh" for="piper-q">Ask Piper a question</label>' +
        '<input id="piper-q" name="piper-q" type="text" placeholder="Ask Piper a question" autocomplete="off" />' +
        '<button type="button" class="piper-panel__iconbtn" aria-label="Use voice">' + MIC + "</button>" +
        '<button type="submit" class="piper-panel__send" aria-label="Send question">' + SEND + "</button>" +
      "</form>" +
      '<p class="piper-panel__legal">Piper is an AI and can make mistakes. Please note, by continuing, you agree to the terms of our <a href="https://www.salesforce.com/company/privacy/" target="_blank" rel="noopener">privacy policy ' + EXT + "</a>. This conversation will be recorded.</p>";
    document.body.appendChild(panel);
  }

  var closeBtn = panel.querySelector(".piper-panel__close");
  var speakBtn = panel.querySelector(".piper-panel__speak");
  var speakLab = panel.querySelector(".piper-panel__speak-lab");
  var salesBtn = panel.querySelector(".piper-panel__sales");
  var form = panel.querySelector(".piper-panel__ask");
  var state = loadState();

  function focusables() {
    return panel.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
  }
  function apply(next, focus) {
    state = next;
    saveState(state);
    btn.hidden = state !== "button";
    panel.hidden = state === "button";
    panel.classList.toggle("is-collapsed", state === "collapsed");
    closeBtn.setAttribute("aria-label", state === "collapsed" ? "Close Piper" : "Collapse Piper");
    speakLab.textContent = state === "collapsed" ? "Speak now" : "Speak with Piper";
    speakBtn.setAttribute("aria-label", speakLab.textContent);
    salesBtn.className = "sf-cta sf-cta--medium piper-panel__sales " + (state === "collapsed" ? "sf-cta--primary" : "sf-cta--secondary");
    btn.setAttribute("aria-expanded", state === "button" ? "false" : "true");
    if (focus === "close") closeBtn.focus();
    else if (focus === "button") btn.focus();
  }
  apply(state, null);

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    apply("open", "close");
  });
  closeBtn.addEventListener("click", function () {
    if (state === "open") apply("collapsed", "close");
    else apply("button", "button");
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  panel.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || panel.hidden) return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || state === "button") return;
    var modal = document.getElementById("modal-root");
    if (modal && modal.innerHTML) return;
    e.preventDefault();
    if (state === "open") apply("collapsed", "close");
    else apply("button", "button");
  });
})();

