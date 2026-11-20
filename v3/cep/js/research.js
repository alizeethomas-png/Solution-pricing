/* ══════════════════════════════════════════════════════════════════
   research.js — hidden researcher panel (R27, R31, §8 fixtures).
   Open: footer link "Research controls" or Alt+Shift+R.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var CEP = window.CEP, FX = CEP.FX, esc = CEP.esc, S = function () { return CEP.S; }, A = CEP.act, I = CEP.inp;

  var FAILS = [
    ["Public / trial", [["trialUnavailable", "Trial unavailable"], ["trialExpired", "Trial already used"]]],
    ["Expansion", [["stale", "Stale account data"], ["signinFail", "Sign-in fails once"], ["priceChanged", "Seat price changes at review"], ["orderFail", "Next order submit fails"]]],
    ["Flex Credits", [["noWallet", "No Digital Wallet data"], ["legacyCredits", "Incompatible credit type"], ["commit", "Commit drawdown unknown"], ["eur", "Contract in EUR"]]],
    ["Seller", [["noPolicy", "Missing policy version"]]]
  ];

  function panel() {
    var s = S(), f = s.rs.failures;
    var h = '<div class="cep-rp__h"><h2 class="sx-h4" style="margin:0">Research controls</h2><button class="sx-x" data-act="rsClose" aria-label="Close research controls">✕</button></div>';
    h += '<p class="sx-fine">Session <code>' + esc(s.session) + "</code> · " + s.events.length + " events</p>";
    h += '<label class="sx-lbl" for="rs-p">Participant label</label><input id="rs-p" type="text" value="' + esc(s.participant) + '" data-in="rsP" placeholder="e.g. P07" />';
    h += '<button class="sf-cta sf-cta--primary sf-cta--medium cep-rp__btn" data-act="rsReset">New participant (reset + new session ID)</button>';
    h += '<h3 class="cep-rp__s">Variant (R31)</h3><div class="sx-seg"><button aria-pressed="' + (s.variant === "guided") + '" data-act="rsVar" data-v="guided">Guided (candidate)</button><button aria-pressed="' + (s.variant === "product") + '" data-act="rsVar" data-v="product">Product-led (control)</button></div>';
    h += '<h3 class="cep-rp__s">Sign-in persona (Expand)</h3><div class="sx-seg"><button aria-pressed="' + ((s.rs.signinRole || "buyer") === "buyer") + '" data-act="rsRole" data-v="buyer">Authorized buyer</button><button aria-pressed="' + (s.rs.signinRole === "admin") + '" data-act="rsRole" data-v="admin">Admin, not a purchaser</button></div>';
    h += '<h3 class="cep-rp__s">Load fixture</h3><div class="cep-rp__fx">' + FX.scenarios.map(function (x) { return '<button class="cep-rp__f" data-act="rsFx" data-id="' + x.id + '" title="' + esc(x.task) + '"><strong>' + x.id + "</strong> " + esc(x.name) + "</button>"; }).join("") + "</div>";
    h += '<h3 class="cep-rp__s">Inject states</h3>' + FAILS.map(function (g) { return "<fieldset><legend>" + esc(g[0]) + "</legend>" + g[1].map(function (x) { return '<label class="sx-chk"><input type="checkbox" data-in="rsFail" data-k="' + x[0] + '"' + (f[x[0]] ? " checked" : "") + " /> " + esc(x[1]) + "</label>"; }).join("") + "</fieldset>"; }).join("");
    h += '<label class="sx-chk"><input type="checkbox" data-in="rsSvc"' + (s.rs.showServices ? " checked" : "") + " /> Show synthetic services ranges (Q5)</label>";
    h += '<h3 class="cep-rp__s">Events</h3><ol class="cep-rp__log" reversed>' + s.events.slice(-12).reverse().map(function (e) { return "<li><code>" + esc(e.event) + "</code> <small>" + esc(e.route) + "</small></li>"; }).join("") + "</ol>";
    h += '<div class="sx-btnrow"><button class="sf-cta sf-cta--secondary sf-cta--medium" data-act="rsExport">Export events (JSON)</button></div>';
    return h;
  }
  function draw() {
    var root = document.getElementById("cep-rp");
    if (!S().rs.open) { root.hidden = true; root.innerHTML = ""; return; }
    root.hidden = false; root.innerHTML = panel();
  }
  CEP.onEvent = function () { if (S().rs.open) { var log = document.querySelector(".cep-rp__log"); if (log) draw(); } };
  A.rsOpen = function () { S().rs.open = true; CEP.save(); draw(); var x = document.querySelector("#cep-rp .sx-x"); if (x) x.focus(); };
  A.rsClose = function () { S().rs.open = false; CEP.save(); draw(); };
  document.addEventListener("keydown", function (e) { if (e.altKey && e.shiftKey && (e.key === "R" || e.key === "r" || e.code === "KeyR")) { e.preventDefault(); S().rs.open ? A.rsClose() : A.rsOpen(); } });
  I.rsP = function (el) { S().participant = el.value; CEP.save(); };
  A.rsReset = function () {
    var old = S().session; CEP.reset(true);
    CEP.track("researcher_reset", { previous: old });
    S().rs.open = true; CEP.save(); location.hash = "#/"; CEP.render(); draw(); CEP.toast("New session " + S().session);
  };
  A.rsRole = function (el) { var s = S(); s.rs.signinRole = el.getAttribute("data-v"); if (s.acct.signedIn) s.acct.role = s.rs.signinRole; CEP.save(); CEP.render(); draw(); };
  A.rsVar = function (el) { S().variant = el.getAttribute("data-v"); CEP.track("context_changed", { variant: S().variant }); CEP.save(); CEP.render(); draw(); };
  I.rsFail = function (el) { S().rs.failures[el.getAttribute("data-k")] = el.checked; CEP.save(); CEP.render(); draw(); };
  I.rsSvc = function (el) { S().rs.showServices = el.checked; CEP.save(); CEP.render(); draw(); };
  A.rsExport = function () { CEP.download("cep-events-" + S().session + ".json", JSON.stringify({ session: S().session, participant: S().participant, variant: S().variant, events: S().events }, null, 2), "application/json"); };
  A.rsFx = function (el) {
    var x = FX.scenarios.filter(function (z) { return z.id === el.getAttribute("data-id"); })[0], s = S();
    CEP.reset(true); s = S(); s.rs.open = true;
    if (x.ctx) { s.ctx.industry = x.ctx.industry; s.ctx.size = x.ctx.size; s.ctx.region = x.ctx.region; s.ctx.goals = x.ctx.goals.slice(); if (x.ctx.goals.indexOf("g_ai") >= 0) s.pub.actions = FX.usage.defaultActions; }
    if (x.edition) { s.pub.ed = x.edition; s.pub.seats = CEP.E.size(x.ctx.size).seats; }
    if (x.role === "buyer" || x.role === "admin") { s.rs.signinRole = x.role; }
    s.participant = s.participant || "";
    CEP.track("researcher_reset", { fixture: x.id });
    CEP.save(); location.hash = x.route; CEP.render(); draw();
    CEP.toast(x.id + " loaded · " + x.task);
  };
  CEP.onRoute = function (path) {
    var map = { "/recommend": "recommendation_viewed", "/estimate": "estimate_rendered", "/account": "footprint_viewed", "/account/credits": "credit_balance_viewed" };
    if (map[path]) CEP.track(map[path], { via: "route" });
    if (path === "/") CEP.track("pricing_entry", { entry: "hub" });
  };
  CEP.drawResearch = draw;
})();
