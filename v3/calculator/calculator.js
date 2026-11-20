/* ══════════════════════════════════════════════════════════════════
   FLEX CREDIT PRICING CALCULATOR — "Before you start"
   Progressive-enhancement IIFE (plain <script defer>, runs from file://).
   Responsibilities:
     1. Show more / less for the extra industry cards.
     2. Mirror the checked radio as .is-selected (fallback for :has()).
     3. Enable "Start Estimate" only when industry + size + currency chosen.
     4. On activation, reveal an aria-live scaffold note (no navigation —
        there is no results page yet; matches the repo's scaffold pattern).
   All lookups are null-guarded so a partial DOM never throws.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var panel = document.querySelector('.calc-panel');
  if (!panel) return;

  var industryGroup = panel.querySelector('.calc-grid--industry');
  var sizeGroup     = panel.querySelector('.calc-grid--size');
  var currency      = document.getElementById('currency-select');
  var startBtn      = panel.querySelector('.calc-start');
  var note          = panel.querySelector('.calc-scaffold');

  /* ── 1. Show more / less ─────────────────────────────────────────── */
  var extra    = document.getElementById('industry-extra');
  var showMore = panel.querySelector('.calc-showmore');
  if (extra && showMore) {
    var label = showMore.querySelector('.calc-showmore__label');
    // Collapse extras and expose the button (hidden by default so no-JS
    // users see — and can select — every industry).
    extra.hidden = true;
    showMore.hidden = false;
    showMore.addEventListener('click', function () {
      var expanded = showMore.getAttribute('aria-expanded') === 'true';
      showMore.setAttribute('aria-expanded', String(!expanded));
      extra.hidden = expanded;
      if (label) label.textContent = expanded ? 'Show more' : 'Show less';
    });
  }

  /* ── 2. Selection mirror (fallback for :has()) ───────────────────── */
  function mirror(groupEl) {
    if (!groupEl) return;
    var cards = groupEl.querySelectorAll('.calc-card');
    for (var i = 0; i < cards.length; i++) {
      var input = cards[i].querySelector('.calc-card__input');
      cards[i].classList.toggle('is-selected', !!(input && input.checked));
    }
  }

  /* ── 3. Enable the CTA when all three inputs are chosen ──────────── */
  function isChosen(name) {
    return !!panel.querySelector('input[name="' + name + '"]:checked');
  }
  function refresh() {
    if (!startBtn) return;
    var ready = isChosen('industry') &&
                isChosen('company-size') &&
                !!(currency && currency.value);
    startBtn.classList.toggle('is-disabled', !ready);
    startBtn.setAttribute('aria-disabled', ready ? 'false' : 'true');
  }

  /* ── 4. Activation — reveal the scaffold note (no navigation) ────── */
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      if (startBtn.getAttribute('aria-disabled') === 'true') return;
      if (note) note.hidden = false;
    });
  }

  /* ── Wire up + initialise ────────────────────────────────────────── */
  panel.addEventListener('change', function (e) {
    var t = e.target;
    if (t && t.name === 'industry')     mirror(industryGroup);
    if (t && t.name === 'company-size') mirror(sizeGroup);
    refresh();
  });

  mirror(industryGroup);
  mirror(sizeGroup);
  refresh();
})();
