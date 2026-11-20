(function () {
  'use strict';

  // Canonical goal order — MUST stay in lockstep with the estimator's
  // PROBS array and the .solution-option button order in index.html.
  // We map a button to its index by MATCHING ITS TEXT (not DOM
  // position), so reordering either side can't silently corrupt the
  // hand-off; any label that doesn't match is simply dropped.
  var GOAL_LABELS = [
    'Grow sales & pipeline',
    'Improve customer service',
    'Automate marketing',
    'Deploy AI agents',
    'Unify customer data',
    'Launch or scale ecommerce',
    'Integrate systems',
    'Analytics & dashboards',
    'Collaboration & productivity',
    'Industry-specific platform'
  ];

  var options = Array.prototype.slice.call(document.querySelectorAll('.solution-option'));
  var form = document.querySelector('.solution-input');
  var input = document.getElementById('solution-query');
  var optionsGrid = document.querySelector('.solution-options__grid');

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function labelIndex(text) { return GOAL_LABELS.indexOf(norm(text)); }

  // Inline error, created lazily. Replaces the old standing "Select one or
  // more" hint (that instruction now lives in the hero body copy); this only
  // appears if the user tries to continue without choosing a goal.
  var errEl = null;
  function showError() {
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'solution-options__error';
      errEl.setAttribute('role', 'alert');
      if (optionsGrid && optionsGrid.parentNode) {
        optionsGrid.parentNode.insertBefore(errEl, optionsGrid);
      }
    }
    errEl.textContent = 'Select at least one goal to continue.';
  }
  function clearError() { if (errEl) errEl.textContent = ''; }

  // Labels of the currently-selected cards, in canonical order — used to
  // mirror the selection into the query input.
  function selectedLabels() {
    var labels = [];
    options.forEach(function (btn) {
      if (btn.getAttribute('aria-pressed') === 'true') labels.push(norm(btn.textContent));
    });
    return labels;
  }
  function syncInput() {
    if (input) input.value = selectedLabels().join(', ');
  }

  // ── Multi-select toggle ───────────────────────────────────────────
  options.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pressed = this.getAttribute('aria-pressed') === 'true';
      this.setAttribute('aria-pressed', pressed ? 'false' : 'true');
      syncInput();   // the selection appears in the input bar
      clearError();  // any engagement clears the gate prompt
    });
  });

  // Carry company + goal params across Your business ↔ Solutions.
  function bizHref(extraG, extraQ) {
    var params = new URLSearchParams(window.location.search);
    var parts = [];
    var g = extraG != null ? extraG : params.get('g');
    var q = extraQ != null ? extraQ : params.get('q');
    if (g) parts.push('g=' + g);
    if (q) parts.push('q=' + encodeURIComponent(q));
    ['ind', 'szi', 'geo'].forEach(function (k) {
      var v = params.get(k);
      if (v !== null && v !== '') parts.push(k + '=' + encodeURIComponent(v));
    });
    parts.push('step=0');
    return '../estimator/index.html?' + parts.join('&');
  }
  function wireBack() {
    var href = bizHref();
    var back = document.getElementById('solution-back');
    var crumb = document.getElementById('crumb-business');
    if (back) back.setAttribute('href', href);
    if (crumb) crumb.setAttribute('href', href);
  }

  // ── Restore state from the URL ────────────────────────────────────
  // Makes Back from Products lossless: re-press the goals and refill
  // the query from ?g= / ?q=. Company params stay on the URL for Back.
  (function restore() {
    var params = new URLSearchParams(window.location.search);
    var g = params.get('g');
    if (g) {
      var wanted = {};
      g.split(',').forEach(function (s) {
        var i = parseInt(s, 10);
        if (!isNaN(i)) wanted[i] = true;
      });
      options.forEach(function (btn) {
        var idx = labelIndex(btn.textContent);
        if (idx >= 0 && wanted[idx]) btn.setAttribute('aria-pressed', 'true');
      });
    }
    var q = params.get('q'); // URLSearchParams already decodes
    if (q && input) input.value = q;
    else syncInput(); // otherwise mirror any restored card selections
    wireBack();
  }());

  // ── Continue → launch the estimator, carrying goals forward ───────
  function selectedIndices() {
    var idxs = [];
    options.forEach(function (btn) {
      if (btn.getAttribute('aria-pressed') === 'true') {
        var idx = labelIndex(btn.textContent);
        if (idx >= 0 && idxs.indexOf(idx) < 0) idxs.push(idx);
      }
    });
    idxs.sort(function (a, b) { return a - b; });
    return idxs;
  }

  if (form) {
    // Covers both the arrow button click and pressing Enter in the input.
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var idxs = selectedIndices();

      // Gate: require at least one goal before advancing.
      if (!idxs.length) {
        showError();
        if (optionsGrid) {
          var firstBtn = optionsGrid.querySelector('.solution-option');
          if (firstBtn) firstBtn.focus();
        }
        return;
      }

      var qs = 'g=' + idxs.join(',');
      var q = input && input.value ? input.value.trim() : '';
      if (q) qs += '&q=' + encodeURIComponent(q);
      var params = new URLSearchParams(window.location.search);
      ['ind', 'szi', 'geo'].forEach(function (k) {
        var v = params.get(k);
        if (v !== null && v !== '') qs += '&' + k + '=' + encodeURIComponent(v);
      });
      window.location.href = '../estimator/index.html?' + qs;
    });
  }
}());
