/* Run: node tests/engine.test.js — no dependencies. */
"use strict";
var FX = require("../js/fixtures.js");
FX.setToday("2026-11-02"); // pin the calendar so date-based tests are stable
global.CEP_FX = FX;
var E = require("../js/engine.js");
var pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; console.log("  ✓ " + name); } catch (e) { fail++; console.log("  ✗ " + name + " — " + e.message); } }
function eq(a, b, m) { if (a !== b) throw new Error((m || "") + " expected " + JSON.stringify(b) + " got " + JSON.stringify(a)); }
function ok(v, m) { if (!v) throw new Error(m || "assertion failed"); }

console.log("Discovery and estimate");
t("R02 no answers still returns non-personalized options", function () { var o = E.options({}); ok(o.options.length >= 2); eq(o.recommended, null); eq(o.personalized, false); });
t("R03 FX-A recommends Pro (cheapest full coverage), not the most expensive", function () { eq(E.options({ size: "s1", goals: ["g_sales"] }).recommended, "pro"); });
t("R03 FX-B flags complex SMB need", function () { var o = E.options({ size: "s1", goals: ["g_ai", "g_data"] }); ok(o.complex); eq(o.recommended, "core"); });
t("R04 suggested add-ons are not priced until accepted", function () {
  var a = E.estimate({ ed: "core", seats: 10, accepted: {}, actions: 0 });
  var b = E.estimate({ ed: "core", seats: 10, accepted: { afaddon: 10 }, actions: 0 });
  eq(a.knownAnnual, 195 * 10 * 12); eq(b.knownAnnual, 195 * 10 * 12 + 125 * 10 * 12);
});
t("R05 Max includes Agentforce add-on once (not charged twice)", function () {
  var e = E.estimate({ ed: "max", seats: 10, accepted: { afaddon: 10 }, actions: 0 });
  eq(e.knownAnnual, 550 * 10 * 12); ok(e.lines.filter(function (l) { return l.id === "afaddon"; })[0].included);
});
t("R07 unpriced item → null amount, partial total, never $0", function () {
  var e = E.estimate({ ed: "core", seats: 10, accepted: { b2b: 1 }, actions: 0 });
  var l = e.lines.filter(function (x) { return x.id === "b2b"; })[0];
  eq(l.amount, null); ok(e.partial); eq(e.knownAnnual, 195 * 10 * 12);
});
t("R07 'from' price makes total partial", function () { ok(E.estimate({ ed: "core", seats: 5, accepted: { mule: 1 }, actions: 0 }).partial); });
t("R29 unsupported region → unpriced, not converted", function () { var e = E.estimate({ ed: "core", seats: 5, accepted: {}, region: "emea" }); ok(!e.priceable); eq(e.lines[0].amount, null); });
t("Unsupported currency → unpriced", function () { ok(!E.estimate({ ed: "st", seats: 5, accepted: {}, currency: "EUR" }).priceable); });
t("R08 seat change recalculates deterministically", function () { for (var n = 1; n < 200; n += 17) eq(E.estimate({ ed: "adv", seats: n, accepted: {} }).knownAnnual, 395 * n * 12); });
t("R09 usage under included credits → no incremental charge", function () { var c = E.creditCalc(1000, 500000); eq(c.annual, 240000); eq(c.packs, 0); eq(c.cost, 0); });
t("R09 usage over included credits → only incremental, rounded to 100K packs", function () { var c = E.creditCalc(5000, 500000); eq(c.incremental, 700000); eq(c.packs, 7); eq(c.cost, 3500); });
t("R10 services never summed into total", function () { var e = E.estimate({ ed: "core", seats: 10, accepted: {}, goals: ["g_integrate"] }); eq(e.knownAnnual, 195 * 120); eq(e.services.band.id, "high"); });
t("Incompatible add-on is excluded and marks partial", function () { var e = E.estimate({ ed: "st", seats: 5, accepted: { d360: 5 } }); ok(e.lines[1].incompatible); ok(e.partial); eq(e.knownAnnual, 25 * 5 * 12); });
t("Add-on unavailable on Pro is excluded from the total", function () {
  var e = E.estimate({ ed: "pro", seats: 10, accepted: { afaddon: 10, d360: 5 } });
  ok(e.lines.filter(function (l) { return l.id === "afaddon"; })[0].incompatible);
  ok(e.lines.filter(function (l) { return l.id === "d360"; })[0].incompatible);
  eq(e.knownAnnual, 100 * 10 * 12);
});
t("R11 PayGo blocked with Agentforce add-on; alternative offered", function () { var r = E.buyingModelCheck("payg", "core", { afaddon: 1 }, true); ok(!r.ok); eq(r.alternative, "Pre-purchase"); });
t("R26 free text maps to controlled goals; unknown text not understood", function () { var r = E.suggestGoals("AI agent for order status and unify customer data"); ok(r.ids.indexOf("g_ai") >= 0 && r.ids.indexOf("g_data") >= 0); eq(E.suggestGoals("blue elephants").understood, false); });

console.log("Expansion: add seats (F5)");
t("FX-D 10 seats prorated for 91 of 365 days at account rate", function () { var q = E.seatQuote({ lic: "sales_adv", qty: 10, role: "buyer", effective: "2026-11-02" }); ok(q.ok); eq(q.remDays, 91); eq(q.prorated, Math.round(10 * 375 * 12 * 91 / 365)); eq(q.lic.listRate, 395); });
t("FX-E admin-not-buyer is blocked", function () { ok(E.seatQuote({ lic: "sales_adv", qty: 10, role: "admin" }).blocks.some(function (b) { return b.code === "unauthorized"; })); });
t("R19 quantity over limit is blocked", function () { ok(E.seatQuote({ lic: "sales_adv", qty: 26, role: "buyer" }).blocks.some(function (b) { return b.code === "cap"; })); });
t("Contract conflict product blocked", function () { ok(!E.seatQuote({ lic: "svc_core", qty: 1, role: "buyer" }).ok); });
t("Stale account data blocks order", function () { ok(!E.seatQuote({ lic: "sales_adv", qty: 1, role: "buyer", failures: { stale: true } }).ok); });

console.log("Expansion: Flex Credit top-up (F6)");
t("Balance = included + purchased − used (no double count)", function () { var p = E.creditPosition({}); eq(p.available, 1000000 + 500000 - 1320000); });
t("R33 calculator estimate is scaled to remaining term and reduced by balance", function () {
  var r = E.creditPlan({ role: "buyer", estimateAnnual: 2000000, packs: 0 });
  eq(r.need, Math.round(2000000 * r.pos.remMonths / 12)); eq(r.unmet, r.need - 180000); eq(r.suggestedPacks, Math.ceil(r.unmet / 100000));
});
t("R33 estimate never auto-orders (packs stay as chosen)", function () { var r = E.creditPlan({ role: "buyer", estimateAnnual: 2000000, packs: 0 }); eq(r.packs, 0); ok(!r.ok); });
t("Estimate below balance → zero unmet", function () { eq(E.creditPlan({ role: "buyer", estimateAnnual: 100000, packs: 1 }).unmet, 0); });
t("No wallet → blocked, no reconciliation numbers", function () { var r = E.creditPlan({ role: "buyer", packs: 3, failures: { noWallet: true } }); ok(!r.ok); eq(r.unmet, null); });
t("Incompatible type / commit / currency / 12m horizon / PayGo all block", function () {
  [{ legacyCredits: true }, { commit: true }, { eur: true }].forEach(function (f) { ok(!E.creditPlan({ role: "buyer", packs: 3, failures: f }).ok); });
  ok(!E.creditPlan({ role: "buyer", packs: 3, horizon: "12m" }).ok); ok(!E.creditPlan({ role: "buyer", packs: 3, model: "payg" }).ok);
});
t("Self-service cap at 2M credits", function () { ok(E.creditPlan({ role: "buyer", packs: 21 }).blocks.some(function (b) { return b.code === "cap"; })); ok(E.creditPlan({ role: "buyer", packs: 20 }).ok); });
t("Price uses account fixture pack price", function () { eq(E.creditPlan({ role: "buyer", packs: 3 }).price, 1500); });

console.log("Combined order: seats + credits (v3)");
t("Seats and credits in one order: due now = prorated seats + packs", function () {
  var r = E.cartQuote({ role: "buyer", seats: { sales_adv: 10 }, packs: 3, effective: "2026-11-02" });
  ok(r.ok); eq(r.dueNow, Math.round(10 * 375 * 12 * 91 / 365) + 1500); eq(r.ongoingAnnual, 10 * 375 * 12);
});
t("Seats only and credits only both valid", function () { ok(E.cartQuote({ role: "buyer", seats: { sales_adv: 2 }, packs: 0 }).ok); ok(E.cartQuote({ role: "buyer", seats: {}, packs: 2 }).ok); });
t("Empty order cannot be reviewed", function () { var r = E.cartQuote({ role: "buyer", seats: {}, packs: 0 }); ok(r.empty); ok(!r.ok); });
t("Admin gets one 'unauthorized' block for the whole order", function () { var r = E.cartQuote({ role: "admin", seats: { sales_adv: 2 }, packs: 2 }); eq(r.blocks.filter(function (b) { return b.code === "unauthorized"; }).length, 1); });
t("A credit block does not hide valid seat lines", function () { var r = E.cartQuote({ role: "buyer", seats: { sales_adv: 2 }, packs: 2, failures: { noWallet: true } }); eq(r.seatLines.length, 1); ok(r.blocks.some(function (b) { return b.code === "nowallet" && b.kind === "credits"; })); });
t("No-wallet does not block a seats-only order", function () { ok(E.cartQuote({ role: "buyer", seats: { sales_adv: 2 }, packs: 0, failures: { noWallet: true } }).ok); });
t("Seat cap applies per product in a combined order", function () { ok(E.cartQuote({ role: "buyer", seats: { sales_adv: 30 }, packs: 1 }).blocks.some(function (b) { return b.code === "cap"; })); });

console.log("Flex Credit pricing: $500 per 100K (v5 audit)");
t("Public pack rate is $500 per 100K = $0.005 per credit", function () { eq(FX.usage.packPrice / FX.usage.packCredits, 0.005); eq(FX.account.credits.packPrice / FX.account.credits.packCredits, 0.005); });
t("Agent usage: incremental credits rounded up to 100K packs at $500", function () { [[0, 0], [1, 500], [100000, 500], [100001, 1000], [700000, 3500], [2800000, 14000]].forEach(function (p) { var c = E.creditCalc(p[0] / 240, 0); eq(c.cost, p[1], "credits " + p[0]); }); });
t("Included credits deducted before buying packs (Max covers 2.75M)", function () { eq(E.creditCalc(2750000 / 240, 2750000).cost, 0); eq(E.creditCalc(3000000 / 240, 2750000).cost, 1500); });
t("Top-up price = packs × $500", function () { [1, 3, 7, 20].forEach(function (n) { eq(E.creditPlan({ role: "buyer", packs: n }).price, n * 500); }); });
t("Estimate line uses the same $500/100K", function () { var e = E.estimate({ ed: "core", seats: 10, accepted: {}, actions: 5000 }); var l = e.lines.filter(function (x) { return x.id === "flex"; })[0]; eq(l.unitPrice, 500); eq(l.amount, 3500); });

console.log("Seller Commit (F7)");
t("FX-H Scenario A passes policy", function () { ok(E.commitEval(FX.commit.scenarios.A).valid); });
t("FX-H Scenario B flags cap, unsupported SKU and unallocated share", function () { var c = E.commitEval(FX.commit.scenarios.B).flags.map(function (f) { return f.code; }); ["cap", "sku", "unalloc"].forEach(function (k) { ok(c.indexOf(k) >= 0, k); }); });
t("Missing policy blocks calculation", function () { ok(E.commitEval(FX.commit.scenarios.A, { noPolicy: true }).blocked); });
t("Invalid term and insufficient commit flagged", function () { var sc = JSON.parse(JSON.stringify(FX.commit.scenarios.A)); sc.term = 7; sc.renewal = 100000; sc.day1 = 0; sc.unallocated = 0; var c = E.commitEval(sc).flags.map(function (f) { return f.code; }); ok(c.indexOf("term") >= 0 && c.indexOf("min") >= 0); });

console.log("Fuzz: invariants across random selections");
t("No NaN, totals = sum of priced lines, unknown never counted (1,000 runs)", function () {
  var eds = ["st", "pro", "core", "adv", "max"], mods = FX.modules.map(function (m) { return m.id; });
  for (var i = 0; i < 1000; i++) {
    var acc = {}; mods.forEach(function (m) { if (Math.random() < 0.35) acc[m] = 1 + Math.floor(Math.random() * 50); });
    var e = E.estimate({ ed: eds[i % 5], seats: 1 + Math.floor(Math.random() * 300), accepted: acc, actions: Math.floor(Math.random() * 20000), region: Math.random() < 0.1 ? "emea" : "na" });
    var sum = 0; e.lines.forEach(function (l) { if (l.amount !== null && !l.incompatible) sum += l.amount; ok(l.amount === null || !isNaN(l.amount), "NaN"); });
    eq(e.knownAnnual, sum);
    if (e.lines.some(function (l) { return l.amount === null; })) ok(e.partial, "partial flag");
  }
});

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
