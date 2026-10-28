/* ══════════════════════════════════════════════════════════════════
   faq.js — accordion single-open behaviour
   ────────────────────────────────────────────────────────────────
   Progressive enhancement for the FAQ, which is built from native
   <details>/<summary> elements. Without this file every question still
   expands and collapses on its own (native behaviour). This only adds
   the convenience that opening one question closes the others.

   Plain script (no ES module) so it runs from file://.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(
    document.querySelectorAll(".faq__item")
  );
  if (items.length < 2) return;

  items.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      items.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
