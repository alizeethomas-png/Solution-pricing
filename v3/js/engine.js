/* ══════════════════════════════════════════════════════════════════
   engine.js — deterministic commercial rules (R08). Pure functions,
   no DOM, no AI arithmetic. Everything reads from CEP_FX fixtures.
   Unit tests: tests/engine.test.js (node).
   Rules enforced here:
     • unknown price → amount null, total partial (never $0)      R07
     • included entitlements shown once, deducted first          R05/R09
     • companions only priced when explicitly accepted            R04
     • services range never summed into the software total       R10
     • unsupported buying model → reason + alternative           R11
     • account fixture price beats public list for expansion     §7
   ══════════════════════════════════════════════════════════════════ */
(function (root) {
  "use strict";
  var FX = root.CEP_FX || (typeof require !== "undefined" ? require("./fixtures.js") : null);

  /* ── helpers ──────────────────────────────────────────────────── */
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function ed(id) { return byId(FX.editions, id); }
  function mod(id) { return byId(FX.modules, id); }
  function goal(id) { return byId(FX.goals, id); }
  function size(id) { return byId(FX.sizes, id); }
  function region(id) { return byId(FX.regions, id); }
  function round(n) { return Math.round(n); }
  function money(n, opts) {
    if (n === null || n === undefined || isNaN(n)) return "Not priced";
    opts = opts || {};
    var s = Math.abs(Math.round(n)).toLocaleString("en-US");
    return (n < 0 ? "−" : "") + "$" + s;
  }
  function credits(n) {
    if (n === null || n === undefined || isNaN(n)) return "Unknown";
    var a = Math.abs(n);
    if (a >= 1000000) return (n / 1000000).toFixed(a % 1000000 === 0 ? 0 : 2).replace(/\.?0+$/, "") + "M";
    if (a >= 1000) return Math.round(n / 1000) + "K";
    return String(Math.round(n));
  }
  function num(n) { return Math.round(n).toLocaleString("en-US"); }
  function parseDate(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function daysInclusive(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000) + 1; }
  function addDays(s, d) { var t = new Date(parseDate(s) + d * 86400000); return t.toISOString().slice(0, 10); }
  function fmtDate(s) {
    var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var p = s.split("-"); return m[+p[1] - 1] + " " + (+p[2]) + ", " + p[0];
  }
  var ED_ORDER = ["st", "pro", "core", "adv", "max"];
  function edRank(id) { return ED_ORDER.indexOf(id); }

  /* ── goal suggestion (R26: rules, reversible, no AI pricing) ──── */
  function suggestGoals(text) {
    if (!text || !text.trim()) return { ids: [], understood: false };
    var t = text.toLowerCase(), ids = [];
    FX.goals.forEach(function (g) { if (new RegExp(g.kw, "i").test(t)) ids.push(g.id); });
    return { ids: ids, understood: ids.length > 0 };
  }

  /* ── coverage of one goal by one edition (+ accepted modules) ── */
  function coverGoal(gid, edId, accepted) {
    var g = goal(gid), e = ed(edId);
    var base = g.cov[edId] || "gap";
    var reason = (g.reason && (g.reason[edId] || g.reason[edRank(edId) >= 2 ? "core" : edId])) || (base === "full" ? "Covered by this edition." : "");
    var fixes = [], needsUpgrade = false;
    g.fix.forEach(function (mid) {
      var m = mod(mid);
      if (m.includedIn && m.includedIn.indexOf(edId) >= 0) return;
      if (m.reqEd.indexOf(edId) >= 0) fixes.push(mid);
      else needsUpgrade = true;
    });
    var status = base;
    var closedBy = null;
    if (base !== "full" && accepted) {
      for (var i = 0; i < fixes.length; i++) if (accepted[fixes[i]]) { status = "full"; closedBy = fixes[i]; break; }
    }
    if (base !== "full" && !fixes.length && needsUpgrade) reason = reason || "Needs a higher edition.";
    if (!reason) reason = base === "partial" ? "Partly covered" + (fixes.length ? "; needs " + fixes.map(function (f) { return mod(f).name; }).join(", ") + "." : ".") : (fixes.length ? "Not covered; needs " + fixes.map(function (f) { return mod(f).name; }).join(", ") + "." : "Not covered by this edition.");
    return { goal: g, status: status, base: base, reason: reason, fixes: base === "full" ? [] : fixes, needsUpgrade: base !== "full" && !fixes.length && needsUpgrade, closedBy: closedBy, edition: e };
  }

  /* ── recommendations (F1/F3, R03, R06) ──────────────────────────
     Returns 1-3 options aligned on the same seats/context. The
     recommendation is the CHEAPEST option that reaches the best
     achievable coverage, never simply the most expensive. */
  function options(ctx) {
    var sz = size(ctx.size) || null;
    var rg = region(ctx.region || "na") || region("na");
    var seats = ctx.seats || (sz ? sz.seats : 10);
    var eds = (sz ? sz.eds : ["st", "pro", "core"]).filter(function (id) { return !(rg.ineligible && rg.ineligible.indexOf(id) >= 0); });
    var goals = (ctx.goals || []).filter(function (g) { return !!goal(g); });
    var opts = eds.map(function (id) {
      var e = ed(id);
      var rows = goals.map(function (g) { return coverGoal(g, id, null); });
      var full = rows.filter(function (r) { return r.base === "full"; }).length;
      var reach = rows.filter(function (r) { return r.base === "full" || r.fixes.length; }).length;
      var suggested = [];
      rows.forEach(function (r) { r.fixes.forEach(function (f) { if (suggested.indexOf(f) < 0) suggested.push(f); }); });
      var unmet = rows.filter(function (r) { return r.base !== "full" && !r.fixes.length; });
      return { id: id, edition: e, rows: rows, full: full, reach: reach, unmet: unmet, suggested: suggested,
        baseAnnual: e.price * seats * 12, perUser: e.price, seats: seats };
    });
    var rec = null;
    if (goals.length && opts.length) {
      var best = Math.max.apply(null, opts.map(function (o) { return o.reach; }));
      var cands = opts.filter(function (o) { return o.reach === best; });
      cands.sort(function (a, b) { return estimate({ ed: a.id, seats: seats, accepted: defaultAccept(a, seats), actions: 0 }).knownAnnual - estimate({ ed: b.id, seats: seats, accepted: defaultAccept(b, seats), actions: 0 }).knownAnnual; });
      rec = cands[0].id;
    }
    var complex = false, complexWhy = [];
    if (rec && sz && (sz.id === "s1" || sz.id === "s2")) {
      var r = byId(opts, rec);
      if (edRank(rec) >= 2) { complex = true; complexWhy.push("Your goals need a Sales Cloud edition, which is more than most small teams start with."); }
      if (r.suggested.length >= 2) { complex = true; complexWhy.push("It also needs " + r.suggested.length + " companion products."); }
    }
    return { options: opts, recommended: rec, personalized: goals.length > 0, seats: seats, complex: complex, complexWhy: complexWhy, salesLed: !!(sz && sz.salesLed) };
  }
  function defaultAccept(o, seats) {
    var a = {}; o.suggested.forEach(function (m) { a[m] = defaultQty(m, seats); }); return a;
  }
  function defaultQty(mid, seats) {
    var m = mod(mid);
    if (m.qtyFrom === "seats") return seats;
    if (m.qtyFrom === "half-seats") return Math.max(1, Math.ceil(seats / 2));
    if (m.qtyFrom === "profiles") return Math.max(5, Math.ceil(seats * 0.5)); // thousands of profiles
    return 1;
  }

  /* ── Flex Credit consumption after included allowance (R09) ──── */
  function creditCalc(actionsPerMonth, includedCredits) {
    var annual = Math.max(0, actionsPerMonth || 0) * FX.usage.creditsPerAction * 12;
    var covered = Math.min(annual, includedCredits || 0);
    var incremental = annual - covered;
    var packs = Math.ceil(incremental / FX.usage.packCredits);
    return { annual: annual, included: includedCredits || 0, covered: covered, incremental: incremental, packs: packs,
      packCredits: packs * FX.usage.packCredits, cost: packs * FX.usage.packPrice };
  }

  /* ── services band (synthetic, never summed) ─────────────────── */
  function servicesBand(goals, products) {
    var g = goals || [];
    var id = "low";
    if (products >= 2 || g.indexOf("g_data") >= 0) id = "med";
    if (g.indexOf("g_integrate") >= 0 || g.indexOf("g_commerce") >= 0 || products >= 4) id = "high";
    return byId(FX.services.bands, id);
  }

  /* ── consolidated estimate (R07-R10) ──────────────────────────
     sel: { ed, seats, billing, accepted:{modId:qty}, actions, region,
            currency, goals, showServices } */
  function estimate(sel) {
    var e = ed(sel.ed);
    var seats = Math.max(0, sel.seats || 0);
    var rg = region(sel.region || "na") || region("na");
    var cur = sel.currency || "USD";
    var priceable = rg.priced && cur === "USD";
    var unpricedWhy = !rg.priced ? "Prices for " + rg.name + " aren't in this prototype. We don't convert USD." : (cur !== "USD" ? cur + " prices aren't available here. We don't convert currencies." : "");
    var lines = [], notes = [], partial = false, hasFrom = false;
    var meta = { currency: "USD", date: FX.meta.asOf, source: FX.meta.priceSource, taxes: "Excludes taxes" };

    function push(l) { l.meta = meta; lines.push(l); return l; }

    if (!e) return { lines: [], knownAnnual: 0, softwareAnnual: 0, consumptionAnnual: 0, partial: true, monthly: 0, notes: ["Choose an edition."], services: null };

    var billNote = sel.billing === "monthly" && e.billing.indexOf("monthly") >= 0 ? "Billed monthly" : "Billed annually";
    if (sel.billing === "monthly" && e.billing.indexOf("monthly") < 0) notes.push(e.name + " is billed annually only, so annual billing is used.");
    var seatWarn = e.maxSeats && seats > e.maxSeats ? e.maxSeatsNote : null;

    push({ id: "ed", cat: "software", label: e.name, qty: seats, unitLabel: "users (seats)", unit: e.unit, unitPrice: e.price,
      amount: priceable ? e.price * seats * 12 : null, status: priceable ? e.status : "unpriced", note: priceable ? billNote : unpricedWhy, warn: seatWarn });
    if (!priceable) partial = true;

    // included entitlements, represented ONCE (R05)
    var incl = [];
    if (e.credits) incl.push(credits(e.credits) + " Flex Credits per org/year");
    incl.push(e.slack);
    if (e.id === "max") incl.push("Agentforce for employees");

    var acc = sel.accepted || {};
    var productCount = 1;
    Object.keys(acc).forEach(function (mid) {
      var m = mod(mid); if (!m) return;
      var q = acc[mid];
      if (m.includedIn && m.includedIn.indexOf(e.id) >= 0) {
        push({ id: mid, cat: "software", label: m.name, qty: q, amount: 0, included: true, status: "included", note: "Included in " + e.name + ". Not charged twice." });
        return;
      }
      if (m.reqEd.indexOf(e.id) < 0) {
        push({ id: mid, cat: "software", label: m.name, qty: q, amount: null, incompatible: true, status: "incompatible", note: "Not available with " + e.name + ". Excluded from the total." });
        partial = true; return;
      }
      productCount++;
      var unitPrice = m.price === "edition" ? e.price : m.price;
      var amt = null, qtyLabel = "", unitLabel = m.unit;
      if (m.status === "unpriced" || unitPrice === null) { amt = null; partial = true; }
      else if (m.unit === "user/mo") { amt = unitPrice * q * 12; qtyLabel = "users (seats)"; unitLabel = "user/mo"; }
      else if (m.unit === "1K profiles/yr") { amt = unitPrice * q; qtyLabel = "K profiles"; }
      else if (m.unit === "org/mo") { amt = unitPrice * 12; qtyLabel = "org"; }
      if (!priceable) { amt = null; partial = true; }
      if (m.status === "from" && amt !== null) { hasFrom = true; partial = true; }
      push({ id: mid, cat: "software", label: m.name, qty: q, unitLabel: qtyLabel, unit: unitLabel, unitPrice: unitPrice,
        amount: amt, status: priceable ? m.status : "unpriced",
        note: m.status === "unpriced" ? "No public price. Talk to Sales." : (m.status === "from" ? "Starting price; final price depends on scope." : (priceable ? "" : unpricedWhy)) });
    });

    // consumption
    var cc = null;
    if (sel.actions > 0) {
      if (edRank(e.id) < 2) {
        push({ id: "flex", cat: "consumption", label: "Agent actions (Flex Credits)", amount: null, incompatible: true, status: "incompatible", note: "AI agents aren't available on " + e.name + ". Usage is excluded." });
        partial = true;
      } else {
        cc = creditCalc(sel.actions, e.credits);
        push({ id: "flex", cat: "consumption", label: "Flex Credits for agent actions", qty: cc.packs, unitLabel: "× 100K packs", unit: "100K credits", unitPrice: FX.usage.packPrice,
          amount: priceable ? cc.cost : null, status: priceable ? (cc.packs === 0 ? "included" : "illustrative") : "unpriced", calc: cc, covered: cc.packs === 0, included: priceable && cc.packs === 0,
          note: num(sel.actions) + " actions/mo × 20 credits × 12 = " + credits(cc.annual) + "/yr; " + credits(cc.covered) + " covered by included credits; " + credits(cc.incremental) + " incremental." });
        if (!priceable) partial = true;
      }
    }

    var band = servicesBand(sel.goals, productCount);
    var services = { band: band, show: sel.showServices !== false, status: "synthetic", excluded: FX.services.excluded };

    var software = 0, consumption = 0;
    lines.forEach(function (l) { if (l.amount !== null && !l.incompatible) { if (l.cat === "software") software += l.amount; else consumption += l.amount; } });
    var known = software + consumption;
    var unknown = lines.filter(function (l) { return l.amount === null; }).map(function (l) { return l.label; });

    return { edition: e, lines: lines, included: incl, softwareAnnual: software, consumptionAnnual: consumption,
      knownAnnual: known, monthly: known / 12, partial: partial, hasFrom: hasFrom, unknown: unknown, services: services,
      priceable: priceable, unpricedWhy: unpricedWhy, notes: notes, credits: cc,
      status: partial ? "partial" : "illustrative",
      assumptions: [
        "Public list prices read " + FX.meta.asOf + "; USD; excludes taxes; no discounts applied.",
        seats + " users on " + e.name + (sel.billing === "monthly" && e.billing.indexOf("monthly") >= 0 ? ", billed monthly" : ", annual term") + ".",
        sel.actions > 0 ? num(sel.actions) + " agent actions per month (your input), 20 Flex Credits per action." : "No AI agent usage entered.",
        "Included allowances are deducted before any incremental credits.",
        "Services range is synthetic and shown separately; it is not added to the total."
      ] };
  }

  /* ── buying-model eligibility (R11) ──────────────────────────── */
  function buyingModelCheck(model, edId, accepted, hasUsage) {
    var e = ed(edId), reasons = [];
    if (!hasUsage) return { ok: true, na: true, reasons: ["Buying models apply to Flex Credit usage. Your estimate has no usage yet."] };
    if (e.models.indexOf(model) < 0) reasons.push(e.name + " doesn't support this buying model.");
    Object.keys(accepted || {}).forEach(function (mid) {
      var m = mod(mid);
      if (m && m.blocksModels && m.blocksModels.indexOf(model) >= 0 && !(m.includedIn && m.includedIn.indexOf(edId) >= 0))
        reasons.push(m.name + " isn't available with this buying model.");
    });
    return { ok: reasons.length === 0, reasons: reasons, alternative: reasons.length ? "Pre-purchase" : null };
  }

  /* ── F5 add-seat simulator (R19) ─────────────────────────────── */
  function seatQuote(input) {
    var A = FX.account, f = input.failures || {};
    var lic = byId(A.licenses, input.lic) || A.licenses[0];
    var qty = Math.floor(input.qty || 0);
    var eff = input.effective || FX.meta.today;
    var termDays = daysInclusive(A.termStart, A.termEnd);
    var remDays = Math.max(0, daysInclusive(eff, A.termEnd));
    var rate = lic.rate;
    if (input.rateOverride) rate = input.rateOverride; // e.g. price changed at review (R22)
    var blocks = [];
    if (input.role !== "buyer") blocks.push({ code: "unauthorized", msg: "Only an authorized buyer can place this order. Jordan Lee is the authorized buyer on this contract (synthetic)." });
    if (!lic.eligible) blocks.push({ code: "contract", msg: lic.reason });
    if (qty < 1) blocks.push({ code: "invalid", msg: "Enter at least 1 seat." });
    if (lic.selfServeMax && qty > lic.selfServeMax) blocks.push({ code: "cap", msg: "Self-service orders are limited to " + lic.selfServeMax + " seats (synthetic). Larger changes go through your account team." });
    if (parseDate(eff) < parseDate(FX.meta.today)) blocks.push({ code: "date", msg: "The effective date can't be in the past." });
    if (parseDate(eff) > parseDate(A.termEnd)) blocks.push({ code: "date", msg: "The effective date is after your contract ends (" + fmtDate(A.termEnd) + ")." });
    if (f.stale) blocks.push({ code: "stale", msg: "Your account data is out of date. Refresh to load your current licenses before ordering." });
    var prorated = rate !== null ? round(qty * rate * 12 * remDays / termDays) : null;
    return { lic: lic, qty: qty, rate: rate, effective: eff, termDays: termDays, remDays: remDays,
      prorated: prorated, annualRun: rate !== null ? qty * rate * 12 : null, renewalNote: "From " + fmtDate(addDays(A.termEnd, 1)) + " these seats renew at the then-current contract rate.",
      newTotal: lic.qty + qty, blocks: blocks, ok: blocks.length === 0 };
  }

  /* ── F6 Flex Credit position + reconciliation (R20, R33) ─────── */
  function creditPosition(failures) {
    var C = FX.account.credits, f = failures || {};
    if (!C.wallet || f.noWallet) return { known: false };
    var total = C.included + C.purchased;
    var available = total - C.used;
    var avgBurn = C.burn.reduce(function (s, b) { return s + b.v; }, 0) / C.burn.length;
    var remDays = daysInclusive(FX.meta.today, FX.account.termEnd);
    var remMonths = remDays / (365 / 12);
    var forecastNeed = round(avgBurn * remMonths);
    var shortfall = Math.max(0, forecastNeed - available);
    var runoutDays = Math.floor(available / (avgBurn / (365 / 12)));
    return { known: true, total: total, included: C.included, purchased: C.purchased, used: C.used, available: available,
      avgBurn: avgBurn, remDays: remDays, remMonths: remMonths, forecastNeed: forecastNeed, shortfall: shortfall,
      runout: addDays(FX.meta.today, runoutDays), usedPct: C.used / total };
  }

  function creditPlan(input) {
    var A = FX.account, C = A.credits, f = input.failures || {};
    var pos = creditPosition(f);
    var est = input.estimateAnnual > 0 ? Math.floor(input.estimateAnnual) : null;
    var horizon = input.horizon || "term";
    var model = input.model || C.buyingModel;
    var blocks = [], warns = [];
    var needSource = "forecast", need = null, unmet = null;

    if (pos.known) {
      if (est !== null && horizon === "term") {
        needSource = "estimate";
        need = round(est * pos.remMonths / 12);
      } else need = pos.forecastNeed;
      unmet = Math.max(0, need - pos.available);
    }
    var suggestedPacks = unmet !== null ? Math.ceil(unmet / C.packCredits) : null;
    var packs = Math.max(0, Math.floor(input.packs || 0));
    var buyCredits = packs * C.packCredits;
    var price = packs * C.packPrice;

    if (input.role !== "buyer") blocks.push({ code: "unauthorized", msg: "Only an authorized buyer can top up credits. Jordan Lee is the authorized buyer on this contract (synthetic)." });
    if (!pos.known) blocks.push({ code: "nowallet", msg: "We can't load your Digital Wallet balance right now, so we can't check what you already have. To avoid buying credits you don't need, we've paused self-service top-up." });
    if (f.legacyCredits) blocks.push({ code: "type", msg: "This org still uses legacy Data Services Credits. They have to be swapped for Flex Credits before a Flex Credit top-up. Your account team can do this." });
    if (f.commit) blocks.push({ code: "commit", msg: "This account has a Salesforce Commit agreement and we can't confirm how a top-up would draw down from it. Your account team will confirm." });
    if (f.eur) blocks.push({ code: "currency", msg: "Your contract is in EUR but these packs are priced in USD. We don't convert currencies; your account team can quote in EUR." });
    if (horizon === "12m") blocks.push({ code: "horizon", msg: "Credits bought now expire when your term ends on " + fmtDate(A.termEnd) + ". Planning for the next 12 months is part of your renewal, which your account team handles." });
    if (C.models[model] !== true) blocks.push({ code: "model", msg: C.models[model] || "This buying model isn't available.", alt: "Pre-purchase" });
    if (packs < 1) blocks.push({ code: "invalid", msg: "Choose at least one 100K pack." });
    if (buyCredits > C.selfServeMax) blocks.push({ code: "cap", msg: "Self-service top-ups are limited to " + credits(C.selfServeMax) + " credits (synthetic). Larger amounts go through your account team." });

    if (pos.known && unmet !== null && packs > 0 && buyCredits > unmet + 2 * C.packCredits)
      warns.push("This is " + credits(buyCredits - unmet) + " more than your estimated need. Unused credits expire on " + fmtDate(C.expiry) + ".");
    if (pos.known && est !== null && horizon === "term")
      warns.push("The calculator gives a first-year estimate (" + credits(est) + "/yr). Your current term has about " + pos.remMonths.toFixed(1) + " months left, so we scaled it to " + credits(need) + ".");

    return { pos: pos, est: est, horizon: horizon, needSource: needSource, need: need, unmet: unmet,
      suggestedPacks: suggestedPacks, packs: packs, buyCredits: buyCredits, price: price,
      newAvailable: pos.known ? pos.available + buyCredits : null, model: model,
      blocks: blocks, warns: warns, ok: blocks.length === 0 };
  }

  /* ── F5+F6 combined expansion order (seats and credits together) ─
     input: { role, seats:{licId:qty}, effective, packs, model,
              estimateAnnual, horizon, failures, rateOverride:{licId:rate} } */
  function cartQuote(input) {
    var A = FX.account, f = input.failures || {}, ro = input.rateOverride || {};
    var seatLines = [], blocks = [], warns = [];
    Object.keys(input.seats || {}).forEach(function (lid) {
      var q = Math.floor(input.seats[lid] || 0); if (q <= 0) return;
      var r = seatQuote({ lic: lid, qty: q, effective: input.effective, role: "buyer", failures: f, rateOverride: ro[lid] || null });
      seatLines.push(r);
      r.blocks.forEach(function (b) { blocks.push({ code: b.code, msg: b.msg, item: r.lic.name, kind: "seats" }); });
    });
    var packs = Math.max(0, Math.floor(input.packs || 0));
    var plan = creditPlan({ role: "buyer", estimateAnnual: input.estimateAnnual, horizon: input.horizon, packs: packs, model: input.model, failures: f });
    if (packs > 0) {
      plan.blocks.forEach(function (b) { if (b.code !== "invalid") blocks.push({ code: b.code, msg: b.msg, alt: b.alt, item: "Flex Credits", kind: "credits" }); });
      warns = warns.concat(plan.warns);
    }
    var empty = !seatLines.length && packs === 0;
    if (!empty && input.role !== "buyer") blocks.unshift({ code: "unauthorized", msg: "Only an authorized buyer can place this order. " + A.users.buyer.name + " is the authorized buyer on this contract (synthetic).", kind: "all" });
    var seatsDue = seatLines.reduce(function (t, l) { return t + (l.prorated || 0); }, 0);
    var creditsDue = packs > 0 ? plan.price : 0;
    var ongoing = seatLines.reduce(function (t, l) { return t + (l.annualRun || 0); }, 0);
    return { seatLines: seatLines, plan: plan, packs: packs, blocks: blocks, warns: warns, empty: empty,
      seatsDue: seatsDue, creditsDue: creditsDue, dueNow: seatsDue + creditsDue, ongoingAnnual: ongoing,
      ok: !empty && blocks.length === 0 };
  }

  /* ── F7 seller Commit scenario (R24) ─────────────────────────── */
  function commitEval(sc, failures) {
    var P = FX.commit.policy, cats = FX.commit.categories, f = failures || {};
    var flags = [];
    if (f.noPolicy) return { blocked: true, flags: [{ sev: "error", code: "policy", msg: "No policy version is loaded. Scenarios can't be calculated without one.", owner: "Deal Desk" }], valid: false };
    var T = (sc.renewal || 0) + (sc.day1 || 0) + (sc.unallocated || 0);
    var allocTotal = 0, eligibleShare = 0;
    Object.keys(sc.alloc || {}).forEach(function (cid) {
      var pct = +sc.alloc[cid] || 0; if (!pct) return;
      allocTotal += pct;
      var c = byId(cats, cid);
      if (!c) return;
      if (!c.eligible) flags.push({ sev: "error", code: "sku", msg: c.name + ": " + c.why, owner: "Deal Desk review" });
      else {
        eligibleShare += pct;
        if (pct / 100 > c.cap) flags.push({ sev: "error", code: "cap", msg: c.name + " is " + pct + "% of allocated spend; the cap is " + Math.round(c.cap * 100) + "%.", owner: "Deal Desk review" });
      }
    });
    if (allocTotal !== 100) flags.push({ sev: "error", code: "alloc", msg: "Allocations add up to " + allocTotal + "%. They need to total 100%.", owner: "Seller" });
    if (T < P.minAnnual) flags.push({ sev: "error", code: "min", msg: "Annual commitment " + money(T) + " is below the policy minimum of " + money(P.minAnnual) + ".", owner: "Seller" });
    if (!(sc.term >= P.termMin && sc.term <= P.termMax) || Math.floor(sc.term) !== sc.term) flags.push({ sev: "error", code: "term", msg: "Term must be a whole number of years from " + P.termMin + " to " + P.termMax + ".", owner: "Seller" });
    var unallocShare = T ? (sc.unallocated || 0) / T : 0;
    if (unallocShare > P.unallocatedMax) flags.push({ sev: "error", code: "unalloc", msg: "Unallocated amount is " + Math.round(unallocShare * 100) + "% of the commitment; the policy maximum is " + Math.round(P.unallocatedMax * 100) + "%.", owner: "Deal Desk review" });
    var years = [], totalDraw = 0;
    var term = Math.max(1, Math.min(10, Math.floor(sc.term || 1)));
    for (var y = 1; y <= term; y++) {
      var fy = (sc.forecast || 0) * Math.pow(1 + (sc.growth || 0) / 100, y - 1) * (eligibleShare / 100);
      var draw = Math.min(fy, T);
      years.push({ y: y, forecast: round(fy), draw: round(draw), util: T ? draw / T : 0 });
      totalDraw += draw;
    }
    var committed = T * term;
    var shortfall = Math.max(0, round(committed - totalDraw));
    if (shortfall > 0) flags.push({ sev: "warn", code: "shortfall", msg: "Projected eligible drawdown leaves " + money(shortfall) + " of shortfall exposure over the term.", owner: "Seller + Deal Desk" });
    return { T: T, term: term, committed: committed, unallocShare: unallocShare, eligibleShare: eligibleShare, years: years,
      totalDraw: round(totalDraw), utilization: committed ? totalDraw / committed : 0, shortfall: shortfall,
      flags: flags, valid: flags.filter(function (x) { return x.sev === "error"; }).length === 0, policy: P };
  }

  var API = { money: money, credits: credits, num: num, fmtDate: fmtDate, daysInclusive: daysInclusive, addDays: addDays,
    ed: ed, mod: mod, goal: goal, size: size, region: region, edRank: edRank,
    suggestGoals: suggestGoals, coverGoal: coverGoal, options: options, defaultQty: defaultQty,
    creditCalc: creditCalc, servicesBand: servicesBand, estimate: estimate, buyingModelCheck: buyingModelCheck,
    seatQuote: seatQuote, cartQuote: cartQuote, creditPosition: creditPosition, creditPlan: creditPlan, commitEval: commitEval };
  root.CEP_ENGINE = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : globalThis);
