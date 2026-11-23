/* ══════════════════════════════════════════════════════════════════
   suite-features.js — v3-only aligned feature matrix for Options.
   Derives one row per BOM family across Core / Advanced / Max, with
   status included | partial | none. Partial = present, but a lower
   edition or capacity than the highest value in this industry+cloud.
   Loaded after industry-suites.js.
   ══════════════════════════════════════════════════════════════════ */
(function (root) {
  "use strict";
  var SU = root.CEP_SUITES || (typeof require !== "undefined" ? require("./industry-suites.js") : null);
  if (!SU) return;

  var TIERS = ["core", "advanced", "max"];
  var SKIP = /^Slack\b/i;

  /**
   * @typedef {"included"|"partial"|"none"} FeatureStatus
   * @typedef {Object} FeatureCell
   * @property {FeatureStatus} status
   * @property {string} name
   * @property {string} variant
   * @property {number} rank
   * @typedef {Object} FeatureRow
   * @property {string} id
   * @property {string} name
   * @property {Object.<string, FeatureCell|null>} cells  core|advanced|max
   */

  function familyKey(raw) {
    var s = String(raw || "").replace(/\s+/g, " ").trim();
    s = s.replace(/Provsioning/gi, "Provisioning");
    s = s.replace(/\bFinancial Service Cloud\b/gi, "Financial Services Cloud");
    s = s.replace(/\s*Foundation - Advanced\s*/i, " ");
    s = s.replace(/\s*-\s*(Agentforce 1 Edition|Unlimited Edition(?:\s*-\s*MP)?|Enterprise Edition(?:\s*-\s*MP)?)\s*$/i, "");
    s = s.replace(/\s*-\s*(Sales & Service|Sales|Service)\s*$/i, "");
    s = s.replace(/\s+Cloud Growth\b/gi, " Cloud");
    s = s.replace(/\s+-\s+MP\s*$/i, "");
    s = s.replace(/\s*\(\s*(one per org|\d+\s*(?:K|GB|MB|M))\s*\)\s*$/i, "");
    return s.replace(/\s+/g, " ").trim();
  }

  function rankOf(raw) {
    var s = String(raw || "");
    var cap = 0;
    var m = s.match(/\((\d+)\s*(K|GB|MB|M)\)/i);
    if (m) {
      cap = parseInt(m[1], 10);
      var u = m[2].toUpperCase();
      if (u === "M") cap *= 1000000;
      else if (u === "K") cap *= 1000;
      else if (u === "GB") cap *= 1000000000;
      else if (u === "MB") cap *= 1000000;
    }
    var ed = 1;
    if (/Enterprise\+/i.test(s)) ed = 4;
    else if (/Agentforce 1/i.test(s)) ed = 3;
    else if (/Unlimited/i.test(s)) ed = 2;
    else if (/Business\+/i.test(s)) ed = 2;
    else if (/Enterprise/i.test(s)) ed = 1;
    if (/Foundation - Advanced/i.test(s)) ed = Math.max(ed, 2);
    return cap * 10 + ed;
  }

  function variantOf(raw) {
    var s = String(raw || "");
    var parts = [];
    var ed = s.match(/(Agentforce 1 Edition|Unlimited Edition(?:\s*-\s*MP)?|Enterprise Edition(?:\s*-\s*MP)?|Business\+|Enterprise\+|Foundation - Advanced)/i);
    if (ed) parts.push(ed[1].replace(/\s*Edition/i, "").replace(/\s+/g, " ").trim());
    var cap = s.match(/\((\d+\s*(?:K|GB|MB|M)|one per org)\)/i);
    if (cap) parts.push(cap[1]);
    return parts.join(" · ");
  }

  /**
   * Aligned feature rows for one industry + cloud. Missing tiers get null cells
   * (the column is absent in the explorer, not “not included”).
   * @param {string} industry
   * @param {string} cloud
   * @returns {FeatureRow[]}
   */
  function featureMatrix(industry, cloud) {
    var pack = SU.suites[industry] && SU.suites[industry][cloud || "crm"];
    if (!pack) pack = (SU.suites.core && SU.suites.core[cloud || "crm"]) || {};
    var byFam = {};
    var order = [];

    function add(fam, tier, raw, rank, variant) {
      if (!fam) return;
      if (!byFam[fam]) {
        byFam[fam] = { id: fam, name: fam, cells: { core: null, advanced: null, max: null } };
        order.push(fam);
      }
      var prev = byFam[fam].cells[tier];
      if (!prev || rank > prev.rank) {
        byFam[fam].cells[tier] = { status: "included", name: raw, variant: variant || "", rank: rank };
      }
    }

    TIERS.forEach(function (tier) {
      var ed = pack[tier];
      if (!ed) return;
      (ed.includes || []).forEach(function (item) {
        if (SKIP.test(item)) return;
        add(familyKey(item), tier, item, rankOf(item), variantOf(item));
      });
    });

    order.forEach(function (fam) {
      var row = byFam[fam];
      var maxRank = 0;
      TIERS.forEach(function (tier) {
        if (pack[tier] && row.cells[tier] && row.cells[tier].rank > maxRank) maxRank = row.cells[tier].rank;
      });
      TIERS.forEach(function (tier) {
        if (!pack[tier]) {
          row.cells[tier] = null;
          return;
        }
        if (!row.cells[tier]) {
          row.cells[tier] = { status: "none", name: "", variant: "", rank: 0 };
          return;
        }
        row.cells[tier].status = (row.cells[tier].rank < maxRank) ? "partial" : "included";
      });
    });

    return order.map(function (fam) { return byFam[fam]; });
  }

  SU.featureMatrix = featureMatrix;
  SU.featureFamily = familyKey;
  SU.featureRank = rankOf;

  if (typeof module !== "undefined" && module.exports) module.exports = SU;
})(typeof window !== "undefined" ? window : globalThis);
