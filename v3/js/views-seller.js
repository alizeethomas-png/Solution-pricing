/* ══════════════════════════════════════════════════════════════════
   views-seller.js — Entry C: seller-only Salesforce Commit planner (F7).
   Role-separated: nothing renders until the simulated seller sign-in.
   SYNTHETIC policy and scenarios. No negotiated rates or discounts.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var CEP = window.CEP, FX = CEP.FX, E = CEP.E, esc = CEP.esc, S = function () { return CEP.S; };
  var R = CEP.routes, A = CEP.act, I = CEP.inp, C = FX.commit;

  R["/seller"] = function () {
    var s = S();
    if (!s.seller.auth) {
      var cust = s.acct.signedIn && s.acct.role && s.acct.role !== "seller";
      if (cust || s.acct.blockedSeller) CEP.track("order_blocked_mock", { kind: "commit", reason: "public_persona" });
      var h = '<div class="cep-signin">' + CEP.ic.lock + '<h1 class="sx-h2">Seller workspace</h1>' +
        (cust ? CEP.note("e", "<strong>You don’t have access to this page.</strong> Salesforce Commit planning is only for Salesforce sellers and Deal Desk. Nothing from this workspace is shown to customers. <a href=\"#/account\">Back to your account</a>.") :
          '<p class="sx-sub">Salesforce Commit scenario planning for Salesforce sellers and Deal Desk. Not available to customers or on public pricing pages.</p>') +
        (cust ? "" : '<button class="sf-cta sf-cta--primary sf-cta--medium" data-act="sellerIn">Sign in with Salesforce SSO (simulated)</button>') +
        '<p class="sx-fine">Research prototype. Synthetic policy ' + esc(C.policy.version) + ". No real rate cards, discounts or contracts.</p></div>";
      return CEP.page(h, { narrow: true });
    }
    var f = s.rs.failures;
    var a = E.commitEval(s.seller.A, f), b = E.commitEval(s.seller.B, f);
    var h2 = '<div class="cep-acctbar cep-acctbar--seller"><div><span class="sx-tagline">Seller workspace · internal</span><strong>' + esc(C.account) + '</strong><span class="sx-mod__d">Policy ' + (f.noPolicy ? "<b>not loaded</b>" : esc(C.policy.version) + " (effective " + E.fmtDate(C.policy.effective) + ")") + ' · synthetic</span></div><div class="sx-btnrow"><button class="sx-link" data-act="sellerOut">Sign out</button></div></div>';
    h2 += '<h1 class="sx-h2">Plan Salesforce Commit</h1><p class="sx-sub">Model two commitment scenarios, check them against policy, and see drawdown and shortfall exposure before Deal Desk review.</p>';
    if (f.noPolicy) h2 += CEP.note("e", "<strong>No policy version is loaded.</strong> Scenarios can’t be checked or exported without one. Ask Deal Desk to publish the current policy. <button class=\"sx-link\" data-act=\"loadPolicy\">Reload policy</button>");
    h2 += '<details class="sx-det sx-det--box"><summary>Policy rules (' + esc(C.policy.version) + ')</summary><ul><li>Minimum annual commitment ' + E.money(C.policy.minAnnual) + "</li><li>Term " + C.policy.termMin + "–" + C.policy.termMax + " whole years</li><li>Unallocated amount up to " + Math.round(C.policy.unallocatedMax * 100) + "% of the commitment</li>" +
      C.categories.map(function (c) { return "<li>" + esc(c.name) + ": " + (c.eligible ? "eligible, cap " + Math.round(c.cap * 100) + "% of allocated spend" : "not eligible — " + esc(c.why)) + "</li>"; }).join("") + "<li>No negotiated rates or discounts are modeled in this prototype.</li></ul></details>";
    h2 += '<div class="cep-scen">' + editor("A", s.seller.A, a) + editor("B", s.seller.B, b) + "</div>";
    if (!f.noPolicy) {
      CEP.track("commit_scenario_compared", { validA: a.valid, validB: b.valid });
      h2 += '<h2 class="sx-h3 sx-mt">Compare</h2><div class="sx-tblw"><table class="sx-tbl"><thead><tr><th scope="col"></th><th scope="col">' + esc(s.seller.A.name) + '</th><th scope="col">' + esc(s.seller.B.name) + "</th></tr></thead><tbody>" +
        cmp("Annual commitment", E.money(a.T), E.money(b.T)) + cmp("Term", a.term + " yrs", b.term + " yrs") + cmp("Total committed", E.money(a.committed), E.money(b.committed)) +
        cmp("Unallocated share", pct(a.unallocShare), pct(b.unallocShare)) + cmp("Allocated to eligible categories", a.eligibleShare + "%", b.eligibleShare + "%") +
        cmp("Projected eligible drawdown", E.money(a.totalDraw), E.money(b.totalDraw)) + cmp("Utilization over term", pct(a.utilization), pct(b.utilization)) +
        cmp("Shortfall exposure", strong(E.money(a.shortfall)), strong(E.money(b.shortfall))) +
        cmp("Policy check", a.valid ? CEP.ic.check + " Passes" : CEP.ic.gap + " " + a.flags.filter(err).length + " issue(s)", b.valid ? CEP.ic.check + " Passes" : CEP.ic.gap + " " + b.flags.filter(err).length + " issue(s)") +
        "</tbody></table></div>";
      h2 += '<div class="sx-actions"><div><h2 class="sx-h4">Deal Desk package</h2><p class="sx-mod__d">Exports both scenarios with assumptions, policy version, risk flags and illustrative labels.</p><div class="sx-btnrow"><button class="sf-cta sf-cta--primary sf-cta--medium" data-act="exportCommit">Export Deal Desk brief</button><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="resetCommit">Reset scenarios</button></div>' + (s.seller.exported ? '<p class="cep-ok-inline">Brief downloaded. Scenarios with issues are tagged for owner review.</p>' : "") + '</div><div><h2 class="sx-h4">Not in scope</h2><p class="sx-fine">Contract generation, real rate cards, negotiated discounts and customer-facing Commit checkout are excluded.</p></div></div>';
    }
    return CEP.page(h2, {});
  };
  function err(x) { return x.sev === "error"; }
  function pct(v) { return Math.round(v * 1000) / 10 + "%"; }
  function strong(v) { return "<strong>" + v + "</strong>"; }
  function cmp(l, x, y) { return '<tr><th scope="row">' + esc(l) + "</th><td>" + x + "</td><td>" + y + "</td></tr>"; }
  function inp(sid, k, v, label, suffix) {
    var id = "c" + sid + "-" + k.replace(".", "-");
    return '<div class="cep-fld"><label class="sx-lbl" for="' + id + '">' + esc(label) + '</label><div class="cep-inrow"><input id="' + id + '" type="number" step="any" value="' + v + '" data-in="sc" data-s="' + sid + '" data-k="' + k + '" />' + (suffix ? "<span>" + esc(suffix) + "</span>" : "") + "</div></div>";
  }
  function editor(sid, sc, ev) {
    var h = '<section class="cep-sc' + (ev.valid ? "" : " is-bad") + '" aria-labelledby="sc' + sid + '"><div class="cep-row-between"><h2 class="sx-h4" id="sc' + sid + '" style="margin:0">' + esc(sc.name) + "</h2>" + (ev.blocked ? '<span class="sx-chip is-pre">Blocked</span>' : ev.valid ? '<span class="sx-chip is-est">Passes policy</span>' : '<span class="sx-chip is-sub">Needs review</span>') + "</div>";
    h += '<div class="cep-grid3">' + inp(sid, "term", sc.term, "Term", "years") + inp(sid, "renewal", sc.renewal, "Renewal ACV", "USD/yr") + inp(sid, "day1", sc.day1, "Day 1 orders", "USD/yr") + inp(sid, "unallocated", sc.unallocated, "Unallocated", "USD/yr") + inp(sid, "forecast", sc.forecast, "Forecast eligible spend, yr 1", "USD") + inp(sid, "growth", sc.growth, "Annual growth", "%") + "</div>";
    h += '<p class="sx-lbl" style="margin-top:12px">Allocation of Renewal + Day 1</p><div class="cep-grid3">' + C.categories.map(function (c) { return inp(sid, "alloc." + c.id, (sc.alloc && sc.alloc[c.id]) || 0, c.name + (c.eligible ? " (cap " + Math.round(c.cap * 100) + "%)" : " (not eligible)"), "%"); }).join("") + "</div>";
    if (!ev.blocked) {
      h += '<ul class="cep-yrs">' + ev.years.map(function (y) { return "<li><span>Year " + y.y + "</span><i style=\"width:" + Math.min(100, Math.round(y.util * 100)) + "%\"></i><b>" + pct(y.util) + "</b></li>"; }).join("") + "</ul>";
    }
    if (ev.flags.length) h += '<ul class="cep-flags">' + ev.flags.map(function (x) { return '<li class="is-' + x.sev + '">' + (x.sev === "error" ? CEP.ic.gap : CEP.ic.warn) + "<span>" + esc(x.msg) + ' <em class="cep-owner">' + esc(x.owner) + "</em></span></li>"; }).join("") + "</ul>";
    return h + "</section>";
  }
  I.sc = function (el) {
    var s = S().seller[el.getAttribute("data-s")], k = el.getAttribute("data-k"), v = +el.value;
    if (isNaN(v)) v = 0;
    if (k.indexOf("alloc.") === 0) { s.alloc = s.alloc || {}; s.alloc[k.slice(6)] = v; } else s[k] = v;
    CEP.save(); CEP.render();
  };
  A.sellerIn = function () { S().seller.auth = true; CEP.track("login_state_selected", { role: "seller" }); CEP.save(); CEP.render(); };
  A.sellerOut = function () { S().seller.auth = false; CEP.save(); CEP.render(); };
  A.loadPolicy = function () { S().rs.failures.noPolicy = false; CEP.save(); CEP.render(); };
  A.resetCommit = function () { S().seller.A = JSON.parse(JSON.stringify(C.scenarios.A)); S().seller.B = JSON.parse(JSON.stringify(C.scenarios.B)); S().seller.exported = false; CEP.save(); CEP.render(); };
  A.exportCommit = function () {
    var s = S(), L = [];
    L.push("DEAL DESK BRIEF — SALESFORCE COMMIT SCENARIOS"); L.push("ILLUSTRATIVE RESEARCH PROTOTYPE · SYNTHETIC DATA · NOT A QUOTE OR CONTRACT");
    L.push("Account: " + C.account + " · Policy: " + C.policy.version + " (effective " + C.policy.effective + ") · Generated " + new Date().toISOString());
    ["A", "B"].forEach(function (k) {
      var sc = s.seller[k], ev = E.commitEval(sc, s.rs.failures);
      L.push(""); L.push("== " + sc.name + (ev.valid ? " — passes policy" : " — OWNER REVIEW REQUIRED") + " ==");
      L.push("Term " + sc.term + " yrs · Renewal " + E.money(sc.renewal) + " · Day 1 " + E.money(sc.day1) + " · Unallocated " + E.money(sc.unallocated));
      L.push("Allocation: " + Object.keys(sc.alloc || {}).filter(function (c) { return sc.alloc[c]; }).map(function (c) { return c + " " + sc.alloc[c] + "%"; }).join(", "));
      L.push("Forecast eligible spend yr1 " + E.money(sc.forecast) + ", growth " + sc.growth + "%/yr");
      if (!ev.blocked) { L.push("Annual commitment " + E.money(ev.T) + " · Total " + E.money(ev.committed) + " · Projected drawdown " + E.money(ev.totalDraw) + " · Utilization " + pct(ev.utilization) + " · Shortfall exposure " + E.money(ev.shortfall)); }
      L.push("Flags:"); if (!ev.flags.length) L.push(" - none"); ev.flags.forEach(function (x) { L.push(" - [" + x.sev.toUpperCase() + "] " + x.msg + " (" + x.owner + ")"); });
    });
    L.push(""); L.push("No negotiated rates or discounts modeled. Commit math is separate from any prepaid wallet balance.");
    CEP.download("deal-desk-brief-ILLUSTRATIVE.txt", L.join("\n"));
    s.seller.exported = true; CEP.track("commit_scenario_compared", { exported: true }); CEP.save(); CEP.render();
  };
})();
