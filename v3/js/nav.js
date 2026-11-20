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
   Ask Piper — shared floating CTA. Mounted once from this layout
   script (loaded on every v1/v2 page) so pages do not duplicate it.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  if (document.getElementById("ask-piper")) return;
  var a = document.createElement("a");
  a.id = "ask-piper";
  a.className = "sf-cta sf-cta--primary sf-cta--medium ask-piper";
  a.href = "#";
  a.setAttribute("aria-label", "Ask Piper");
  a.innerHTML = "<i class='icon icon--sparkles' aria-hidden='true'></i> Ask Piper";
  document.body.appendChild(a);
})();
