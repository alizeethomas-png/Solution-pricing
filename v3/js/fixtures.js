/* ══════════════════════════════════════════════════════════════════
   fixtures.js — ALL commercial and persona data for the prototype.
   ────────────────────────────────────────────────────────────────
   Content (PMM copy) and commercial data (prices, rules) are kept in
   separate objects (R30): CEP_FX.copy vs everything else.

   Price status vocabulary (R07):
     illustrative — public list price read from salesforce.com on asOf;
                    shown for research only, not approved pricing
     from         — published "starting at" price; total becomes partial
     unpriced     — no public price; NEVER rendered as $0
     synthetic    — invented for the prototype (accounts, packs, Commit)
   Every account, contract, order and Commit number is SYNTHETIC.
   ══════════════════════════════════════════════════════════════════ */
(function (root) {
  "use strict";

  var FX = {
    meta: {
      version: "CEP-FX-0.6",
      asOf: "2026-10-28",
      today: "2026-11-02",
      currency: "USD",
      priceSource: "salesforce.com public pricing pages, read 2026-10-28",
      label: "Illustrative research prototype. Not approved pricing. Nothing is purchased, quoted or provisioned."
    },

    links: {
      flexCalculator: "https://www.salesforce.com/agentforce/pricing/calculator/",
      starterTrial: "https://www.salesforce.com/small-business/starter/free-trial/",
      proTrial: "https://www.salesforce.com/small-business/pro-suite/",
      salesTrialCore: "https://www.salesforce.com/sales/free-trial/ee/",
      salesTrialAdv: "https://www.salesforce.com/sales/free-trial/ue/",
      serviceTrial: "https://www.salesforce.com/service/free-trial/ue/",
      industryTrials: "https://developer.salesforce.com/free-trials",
      salesPricing: "https://www.salesforce.com/sales/pricing/",
      agentforcePricing: "https://www.salesforce.com/agentforce/pricing/",
      buyingModels: "https://www.salesforce.com/pricing/flexible-buying-models/"
    },

    regions: [
      { id: "na", name: "North America", priced: true, currencies: ["USD"] },
      { id: "emea", name: "Europe, Middle East & Africa", priced: false, currencies: ["EUR", "GBP"] },
      { id: "apac", name: "Asia Pacific", priced: false, currencies: ["JPY", "AUD"] },
      { id: "latam", name: "Latin America", priced: false, currencies: ["USD"], ineligible: ["st"] }
    ],
    currencies: ["USD", "EUR", "GBP"],

    sizes: [
      { id: "s1", range: "1–50 employees", who: "Small business", seats: 10, eds: ["st", "pro", "core"] },
      { id: "s2", range: "51–200 employees", who: "Growing business", seats: 40, eds: ["st", "pro", "core"] },
      { id: "mm", range: "201–1,000 employees", who: "Mid-market", seats: 150, eds: ["pro", "core", "adv", "max"] },
      { id: "ent", range: "1,000+ employees", who: "Enterprise · pricing with Sales", seats: 500, eds: ["core", "adv", "max"], salesLed: true }
    ],

    industries: [
      { id: "tech", name: "Technology & SaaS", icon: "technology", common: ["g_sales", "g_service", "g_ai"] },
      { id: "fs", name: "Financial Services", icon: "financial-services", common: ["g_service", "g_data", "g_sales"], industryTrial: "Financial Services" },
      { id: "mfg", name: "Manufacturing", icon: "manufacturing", common: ["g_sales", "g_integrate", "g_service"] },
      { id: "rcg", name: "Retail & Consumer Goods", icon: "retail", common: ["g_commerce", "g_market", "g_service"] },
      { id: "hc", name: "Healthcare & Life Sciences", icon: "healthcare", common: ["g_service", "g_data", "g_ai"], industryTrial: "Life Sciences" },
      { id: "ps", name: "Professional Services", icon: "professional-services", common: ["g_sales", "g_service", "g_integrate"] },
      { id: "other", name: "Something else", icon: "industries", common: [] }
    ],

    /* Editions. Prices: public list, per user per month. credits = Flex
       Credits included per org per year. Included allowances are per
       ORG and never stacked across editions (R05/R09). */
    editions: [
      { id: "st", name: "Starter Suite", family: "Small business suite", price: 25, unit: "user/mo",
        billing: ["monthly", "annual"], credits: 0, slack: "Slack Free", status: "illustrative", src: "salesPricing",
        trial: "live", maxSeats: 10, maxSeatsNote: "Starter Suite is for teams of up to 10 users.",
        models: ["prepurchase"],
        blurb: "Sales, service and email marketing basics in one simple CRM.",
        includes: ["Lead, account and opportunity management", "Basic case management", "Email marketing", "Slack Free"],
        limits: ["No forecasting or quoting", "No built-in AI agents", "No Data 360"] },
      { id: "pro", name: "Pro Suite", family: "Small business suite", price: 100, unit: "user/mo",
        billing: ["annual"], credits: 0, slack: "Slack Free", status: "illustrative", src: "salesPricing",
        trial: "live", models: ["prepurchase"],
        blurb: "More automation, forecasting and quoting across the suite.",
        includes: ["Everything in Starter", "Forecasting and quoting", "Workflow automation", "Service with knowledge base"],
        limits: ["No built-in AI agents", "No Data 360", "Annual contract required"] },
      { id: "core", name: "Sales Cloud Core", family: "Sales Cloud (Portfolio 2.0)", price: 195, unit: "user/mo",
        billing: ["annual"], credits: 500000, slack: "Slack Business+", status: "illustrative", src: "salesPricing",
        trial: "live", models: ["prepurchase", "precommit", "payg"],
        blurb: "Full CRM for one function, with built-in AI, Slack and Premier Success.",
        includes: ["Full Sales Cloud CRM", "Built-in AI and 500K Flex Credits per org/year", "Slack Business+", "Tableau Next", "Premier Success"],
        limits: ["Covers one function (sales)", "Unmetered employee Agentforce is an add-on"] },
      { id: "adv", name: "Sales Cloud Advanced", family: "Sales Cloud (Portfolio 2.0)", price: 395, unit: "user/mo",
        billing: ["annual"], credits: 1000000, slack: "Slack Business+", status: "illustrative", src: "salesPricing",
        trial: "live", models: ["prepurchase", "precommit", "payg"],
        blurb: "Everything in Core plus the security suite, more AI and a full sandbox.",
        includes: ["Everything in Core", "1M Flex Credits per org/year", "Security suite", "Full sandbox"],
        limits: ["Covers one function (sales)", "Unmetered employee Agentforce is an add-on"] },
      { id: "max", name: "Sales Cloud Max", family: "Sales Cloud (Portfolio 2.0)", price: 550, unit: "user/mo",
        billing: ["annual"], credits: 2750000, slack: "Slack Enterprise+", status: "illustrative", src: "salesPricing",
        trial: "live", models: ["prepurchase"],
        blurb: "The complete platform with Agentforce included and 2.75M Flex Credits.",
        includes: ["Everything in Advanced", "Agentforce for employees included", "2.75M Flex Credits per org/year", "Slack Enterprise+"],
        limits: ["Pay as you go and Pre-commit buying models aren’t available", "Priced for teams that want the full platform"] }
    ],

    /* Companion products. Never priced into an estimate until the buyer
       explicitly includes them (R04). */
    modules: [
      { id: "svc", name: "Service Cloud (matching edition)", price: "edition", unit: "user/mo", qtyFrom: "half-seats",
        reqEd: ["core", "adv", "max"], status: "illustrative", src: "salesPricing",
        why: "Core, Advanced and Max editions cover one function. Resolving customer issues needs Service Cloud on the same edition." },
      { id: "afaddon", name: "Agentforce add-on", price: 125, unit: "user/mo", qtyFrom: "seats",
        reqEd: ["core", "adv"], includedIn: ["max"], status: "illustrative", src: "agentforcePricing", blocksModels: ["payg", "precommit"],
        why: "Gives your own sellers unmetered AI agents in the flow of work. Already included in Max." },
      { id: "d360", name: "Data 360 Profiles", price: 240, unit: "1K profiles/yr", qtyFrom: "profiles",
        reqEd: ["core", "adv", "max"], status: "illustrative", src: "agentforcePricing",
        why: "Builds one real-time customer profile from your sources. Requires Core or higher." },
      { id: "mcn", name: "Marketing Cloud Next Growth", price: 1500, unit: "org/mo", qtyFrom: "org",
        reqEd: ["core", "adv", "max"], status: "illustrative", src: "salesPricing",
        why: "Multi-channel campaigns and journeys beyond basic email." },
      { id: "mule", name: "MuleSoft integration", price: 2000, unit: "org/mo", qtyFrom: "org",
        reqEd: ["pro", "core", "adv", "max"], status: "from", src: "salesPricing",
        why: "Connects ERP and other systems. Published as a starting price, so the total becomes partial." },
      { id: "b2b", name: "Commerce Cloud B2B", price: null, unit: "contact sales", qtyFrom: "org",
        reqEd: ["core", "adv", "max"], status: "unpriced", src: "salesPricing",
        why: "Online storefronts and ordering. No public price, so it is excluded from the total." }
    ],

    /* Controlled goal IDs (R03). cov = edition coverage; fix = modules
       that close the gap; reason = plain-language coverage note. */
    goals: [
      { id: "g_sales", name: "Sell more efficiently", desc: "Spend less time on admin and more time with buyers",
        kw: "sales|pipeline|lead|deal|forecast|quota|seller|crm|productiv",
        cov: { st: "partial", pro: "full", core: "full", adv: "full", max: "full" }, fix: [],
        reason: { st: "Leads and opportunities, but no forecasting or quoting.", pro: "Forecasting, quoting and automation included." } },
      { id: "g_service", name: "Resolve customer issues faster", desc: "Answer questions and fix problems sooner",
        kw: "service|support|case|ticket|help ?desk|complain",
        cov: { st: "partial", pro: "full", core: "gap", adv: "gap", max: "gap" }, fix: ["svc"],
        reason: { st: "Basic case management only.", pro: "Service with knowledge base included.", core: "Sales Cloud editions cover sales only; add Service Cloud." } },
      { id: "g_ai", name: "Automate routine requests", desc: "Let AI handle repetitive questions and tasks, day or night",
        kw: "\\bai\\b|agent|automat|chatbot|bot|copilot|agentforce",
        cov: { st: "gap", pro: "gap", core: "partial", adv: "partial", max: "full" }, fix: ["afaddon"], needsUsage: true,
        reason: { st: "No AI agents on Starter.", pro: "No AI agents on Pro.", core: "Built-in AI and included Flex Credits; unmetered employee agents are an add-on.", max: "Agentforce for employees included." } },
      { id: "g_data", name: "Know every customer", desc: "See one up-to-date picture of each customer",
        kw: "\\bdata\\b|unif|profile|360|single view|silo",
        cov: { st: "gap", pro: "gap", core: "partial", adv: "partial", max: "partial" }, fix: ["d360"], minEd: "core",
        reason: { st: "Data 360 is not available on Starter.", pro: "Data 360 is not available on Pro.", core: "Needs Data 360 Profiles." } },
      { id: "g_market", name: "Reach the right customers", desc: "Run targeted campaigns and see what works",
        kw: "market|campaign|email|journey|newsletter|segment",
        cov: { st: "partial", pro: "partial", core: "gap", adv: "gap", max: "gap" }, fix: ["mcn"],
        reason: { st: "Basic email marketing included.", core: "Needs Marketing Cloud Next." } },
      { id: "g_integrate", name: "Connect the systems you already use", desc: "Share information with ERP, billing and other tools",
        kw: "integrat|erp|connect|sap|api|legacy|netsuite",
        cov: { st: "gap", pro: "partial", core: "partial", adv: "partial", max: "partial" }, fix: ["mule"],
        reason: { st: "No API access on Starter.", pro: "APIs available; complex integrations need MuleSoft." } },
      { id: "g_commerce", name: "Let customers order online", desc: "Business buyers order and reorder on their own",
        kw: "commerce|store|shop|checkout|order online|ecommerce|e-commerce",
        cov: { st: "partial", pro: "partial", core: "gap", adv: "gap", max: "gap" }, fix: ["b2b"],
        reason: { st: "Commerce basics only.", core: "Needs Commerce Cloud (priced by Sales)." } }
    ],

    usage: { creditsPerAction: 20, packCredits: 100000, packPrice: 500, defaultActions: 5000,
      note: "Agentforce actions use 20 Flex Credits each (public). Flex Credits are sold in 100K packs at $500 list." },

    /* SYNTHETIC services ranges. Q5: values can be hidden (researcher
       switch) until Services/Finance approve. Never summed into the
       software total. */
    services: {
      status: "synthetic",
      bands: [
        { id: "low", label: "Low complexity", low: 5000, high: 15000, when: "1 product, up to 2 goals" },
        { id: "med", label: "Medium complexity", low: 20000, high: 60000, when: "2–3 products or a data goal" },
        { id: "high", label: "High complexity", low: 75000, high: 200000, when: "Integration, commerce or 4+ products" }
      ],
      excluded: ["Taxes", "Partner fees beyond the indicative range", "Data migration from legacy systems", "Third-party apps", "Your internal staff time"]
    },

    buyingModels: [
      { id: "prepurchase", name: "Pre-purchase", desc: "Buy credits up front for the term; usage draws down the balance." },
      { id: "precommit", name: "Pre-commit", desc: "Commit to a yearly baseline billed monthly; true-up if below commitment." },
      { id: "payg", name: "Pay as you go", desc: "No commitment; usage billed monthly in arrears at list rate." }
    ],

    /* Real, existing salesforce.com trials (verified 2026-11-03). No demos.
       Edition pages still use legacy names: Core replaced Enterprise
       Edition, Advanced replaced Unlimited Edition. No public Max trial
       was found, so Max routes to the Advanced trial plus Sales. */
    trials: {
      st: { name: "Starter Suite free trial", product: "Starter Suite", link: "starterTrial", duration: "30 days", users: "Up to 10 users",
        includes: "Sales, service, email marketing and commerce basics, plus Slack", card: "No credit card required",
        data: "Starts with sample data; you can add your own", ends: "Access typically expires if you don't subscribe; data may be deleted after a grace period",
        after: "Subscribe in the trial; your data stays with you", support: "Guided setup and Trailhead" },
      pro: { name: "Pro Suite free trial", product: "Pro Suite", link: "proTrial", duration: "30 days", users: "Trial org limits apply",
        includes: "Everything in Starter plus forecasting, quoting and automation", card: "No credit card required",
        data: "Starts with sample data; you can add your own", ends: "Access typically expires if you don't subscribe; data may be deleted after a grace period",
        after: "Annual contract to continue", support: "Guided setup and Trailhead" },
      core: { name: "Sales Cloud free trial", product: "Sales Cloud", link: "salesTrialCore", pageName: "Enterprise Edition Free 30-Day Trial (Core replaced Enterprise)", duration: "30 days", users: "Trial org limits apply",
        includes: "Full Sales Cloud CRM on the Salesforce Platform", card: "No credit card, no installation",
        data: "Starts with sample data; you can add your own", ends: "Access typically expires if you don't subscribe; data may be deleted after a grace period",
        after: "Buy with a Salesforce account executive", support: "Trailhead and help docs" },
      adv: { name: "Sales Cloud free trial (Advanced)", product: "Sales Cloud", link: "salesTrialAdv", pageName: "Unlimited Edition Free 30-Day Trial (Advanced replaced Unlimited)", duration: "30 days", users: "Trial org limits apply",
        includes: "Sales Cloud with Advanced-level features", card: "No credit card, no installation",
        data: "Starts with sample data; you can add your own", ends: "Access typically expires if you don't subscribe; data may be deleted after a grace period",
        after: "Buy with a Salesforce account executive", support: "Trailhead and help docs" },
      max: { name: "Sales Cloud free trial (Advanced)", product: "Sales Cloud", link: "salesTrialAdv", pageName: "Unlimited Edition Free 30-Day Trial", duration: "30 days", users: "Trial org limits apply",
        includes: "Advanced-level features. There is no public Max trial, so Max-only items such as included Agentforce may not be in the trial.", card: "No credit card, no installation",
        data: "Starts with sample data; you can add your own", ends: "Access typically expires if you don't subscribe; data may be deleted after a grace period",
        after: "Buy with a Salesforce account executive", support: "Trailhead and help docs", maxNote: true }
    },
    serviceTrial: { name: "Service Cloud free trial", link: "serviceTrial", duration: "30 days", note: "Add this if you included Service Cloud in your estimate." },

    /* Industry use-case starters (PROTOTYPE CONCEPT): the trial link is the
       real trial; the guided steps are what a use-case starter would walk
       through. Own use case → Talk to Sales. */
    useCases: {
      tech: [
        { id: "u1", name: "Qualify inbound leads faster", outcome: "Respond to every new lead within a day", goals: ["g_sales"], steps: ["Import 10 sample inbound leads", "Set up a lead assignment rule by region", "Convert a qualified lead into an opportunity"] },
        { id: "u2", name: "Forecast pipeline by segment", outcome: "See next quarter's pipeline by customer segment", goals: ["g_sales"], steps: ["Load the sample pipeline", "Group opportunities by segment", "Review the forecast and flag at-risk deals"] },
        { id: "u3", name: "Answer tier-1 support questions automatically", outcome: "Fewer repetitive tickets for your team", goals: ["g_service", "g_ai"], steps: ["Open the sample support cases", "Turn the top 3 questions into knowledge articles", "Test an automated answer on a new case"] }
      ],
      fs: [
        { id: "u1", name: "Track client relationships and referrals", outcome: "One view of each client and who referred them", goals: ["g_sales", "g_data"], steps: ["Import sample clients and households", "Link a referral to a new client", "See the full relationship on one page"] },
        { id: "u2", name: "Speed up application follow-up", outcome: "No application waits without a next step", goals: ["g_sales"], steps: ["Load sample applications", "Create a follow-up task rule", "Review applications missing a next step"] },
        { id: "u3", name: "Route service requests by priority", outcome: "Urgent client requests reach the right person first", goals: ["g_service"], steps: ["Open sample service requests", "Set a priority-based routing rule", "Resolve one request end to end"] }
      ],
      mfg: [
        { id: "u1", name: "Manage distributor and dealer pipeline", outcome: "See every channel deal in one place", goals: ["g_sales"], steps: ["Import sample distributor accounts", "Log a channel opportunity", "Review the pipeline by distributor"] },
        { id: "u2", name: "Forecast run-rate orders", outcome: "Plan production from expected reorders", goals: ["g_sales", "g_integrate"], steps: ["Load sample order history", "Create a run-rate forecast", "Compare forecast to last quarter"] },
        { id: "u3", name: "Handle warranty and service cases", outcome: "Faster warranty decisions", goals: ["g_service"], steps: ["Open sample warranty cases", "Attach product and serial details", "Close a case with a resolution"] }
      ],
      rcg: [
        { id: "u1", name: "Manage wholesale accounts", outcome: "Know which retailers are growing or slipping", goals: ["g_sales"], steps: ["Import sample retail accounts", "Log a reorder opportunity", "Review accounts by growth"] },
        { id: "u2", name: "Resolve order-status questions", outcome: "Customers get answers without waiting", goals: ["g_service", "g_ai"], steps: ["Open sample order-status cases", "Create a quick-answer template", "Resolve three cases with it"] },
        { id: "u3", name: "Run a seasonal email campaign", outcome: "Reach the right customers at the right time", goals: ["g_market"], steps: ["Pick a sample customer segment", "Build a 2-step email campaign", "Review opens and clicks on sample data"] }
      ],
      hc: [
        { id: "u1", name: "Manage referral and partner outreach", outcome: "Track every provider relationship", goals: ["g_sales"], steps: ["Import sample provider accounts", "Log an outreach activity", "Review referral volume by provider"] },
        { id: "u2", name: "Respond to member and patient inquiries", outcome: "Faster answers to common questions (sample data only)", goals: ["g_service", "g_ai"], steps: ["Open sample inquiries", "Add answers to a knowledge base", "Resolve an inquiry with a saved answer"] },
        { id: "u3", name: "See one view of each contact", outcome: "Fewer duplicate records across teams", goals: ["g_data"], steps: ["Load sample contacts from two sources", "Merge duplicates", "Review the combined record"] }
      ],
      ps: [
        { id: "u1", name: "Track engagements from proposal to signed", outcome: "Know where every proposal stands", goals: ["g_sales"], steps: ["Import sample prospects", "Create a proposal opportunity", "Move it to signed and see the forecast change"] },
        { id: "u2", name: "Forecast billable pipeline", outcome: "Plan staffing from expected work", goals: ["g_sales"], steps: ["Load sample engagements", "Group by practice area", "Review next quarter's pipeline"] },
        { id: "u3", name: "Take in client requests in one place", outcome: "No client request lost in email", goals: ["g_service"], steps: ["Open sample client requests", "Assign by practice", "Resolve one request"] }
      ],
      other: [
        { id: "u1", name: "Organize your customers and deals", outcome: "One place for every customer and deal", goals: ["g_sales"], steps: ["Import 10 sample contacts", "Create your first opportunity", "Log a follow-up task"] },
        { id: "u2", name: "Answer customer questions faster", outcome: "Fewer repeated questions", goals: ["g_service"], steps: ["Open sample cases", "Create a knowledge article", "Resolve a case with it"] },
        { id: "u3", name: "Send a targeted email", outcome: "Reach the right customers", goals: ["g_market"], steps: ["Pick a sample segment", "Build an email", "Review results on sample data"] }
      ]
    },

    /* ── SYNTHETIC existing-customer account (FX-D/E/F) ─────────── */
    account: {
      id: "ACCT-SYN-1042", name: "Northwind Fabrication", contract: "CTR-SYN-0042",
      termStart: "2026-02-01", termEnd: "2027-01-31", currency: "USD", billing: "Annual, invoiced",
      commit: false,
      users: {
        buyer: { name: "Jordan Lee", title: "Sales Ops Director", role: "buyer", roleLabel: "Authorized buyer" },
        admin: { name: "Sam Patel", title: "Salesforce Admin", role: "admin", roleLabel: "System admin (not a purchaser)" }
      },
      licenses: [
        { id: "sales_adv", name: "Sales Cloud Advanced", qty: 40, used: 38, listRate: 395, rate: 375, rateNote: "Negotiated contract rate (synthetic), about 5% below list", eligible: true, selfServeMax: 25 },
        { id: "svc_core", name: "Service Cloud Core", qty: 15, used: 15, listRate: 195, rate: 185, rateNote: "Negotiated contract rate (synthetic), about 5% below list", eligible: false,
          reason: "An amendment for this product is already open (synthetic). Changes go through your account team so the two don't conflict." },
        { id: "slack", name: "Slack Business+", qty: 55, used: 51, rate: null, included: true, eligible: false,
          reason: "Included with your Sales and Service editions. Add seats to those products to get more Slack seats." }
      ],
      credits: {
        wallet: true, type: "Flex Credits", typeNote: "Usable across Agentforce and Data 360",
        included: 1000000, includedNote: "Included with Sales Cloud Advanced (1M per org per year). Included credits are counted once per org, so Service Cloud Core's 500K isn't added on top.",
        purchased: 500000, purchasedNote: "Pre-purchased 2026-03-14 (synthetic)",
        used: 1320000, usedThrough: "2026-10-31",
        burn: [{ m: "Aug", v: 150000 }, { m: "Sep", v: 160000 }, { m: "Oct", v: 170000 }],
        buyingModel: "prepurchase",
        packCredits: 100000, packPrice: 500, listPackPrice: 500, packPriceNote: "Your contract price (synthetic; same as the public list price of $500 per 100K)",
        selfServeMax: 2000000, expiry: "2027-01-31",
        models: { prepurchase: true, payg: "Pay as you go isn't enabled on this contract.", precommit: "Moving to Pre-commit needs a contract amendment with your account team." }
      }
    },

    /* ── SYNTHETIC seller-only Commit policy and scenarios (FX-H) ── */
    commit: {
      account: "Globex Holdings (synthetic)",
      policy: { version: "SYN-COMMIT-0.3", effective: "2026-10-01", minAnnual: 1000000, termMin: 1, termMax: 5, unallocatedMax: 0.25 },
      categories: [
        { id: "crm", name: "CRM seats (Sales, Service)", cap: 1.0, eligible: true },
        { id: "flex", name: "Flex Credits (Agentforce, Data 360)", cap: 0.40, eligible: true },
        { id: "d360", name: "Data 360", cap: 0.30, eligible: true },
        { id: "mule", name: "MuleSoft", cap: 0.25, eligible: true },
        { id: "pos", name: "Commerce POS", cap: 0, eligible: false, why: "Not a Commit-eligible SKU under this policy." },
        { id: "ps", name: "Professional services", cap: 0, eligible: false, why: "Services can't draw down Commit." }
      ],
      scenarios: {
        A: { name: "Scenario A — Balanced", term: 3, renewal: 1800000, day1: 400000, unallocated: 300000, alloc: { crm: 60, flex: 25, d360: 15 }, forecast: 2100000, growth: 8 },
        B: { name: "Scenario B — AI-heavy", term: 3, renewal: 1800000, day1: 900000, unallocated: 1000000, alloc: { crm: 35, flex: 55, pos: 10 }, forecast: 2300000, growth: 5 }
      }
    },

    /* ── Research fixtures FX-A..H (section 8) ──────────────────── */
    scenarios: [
      { id: "FX-A", name: "SMB prospect", route: "#/explore", ctx: { industry: "tech", size: "s1", region: "na", goals: ["g_sales"] }, task: "Identify fit, price, onboarding need, and Try vs Buy." },
      { id: "FX-B", name: "SMB complex need", route: "#/recommend", ctx: { industry: "rcg", size: "s1", region: "na", goals: ["g_ai", "g_data"] }, task: "Does guidance explain why this needs help instead of pushing add-ons?" },
      { id: "FX-C", name: "Mid-market portfolio", route: "#/recommend", ctx: { industry: "mfg", size: "mm", region: "na", goals: ["g_sales", "g_service", "g_integrate", "g_ai"] }, task: "Identify bundled entitlements, implementation range and total uncertainty." },
      { id: "FX-D", name: "Existing admin — add seats", route: "#/account", role: "buyer", task: "Add 10 Sales Cloud Advanced seats; understand proration; finish mock order." },
      { id: "FX-E", name: "Existing restricted user", route: "#/account", role: "admin", task: "Attempt order; understand authorization; escalate without losing context." },
      { id: "FX-F", name: "Seats + credits together", route: "#/account", role: "buyer", task: "Add 10 seats and top up Flex Credits in one order, with and without the public calculator." },
      { id: "FX-G", name: "Trial proof", route: "#/try", ctx: { industry: "tech", size: "mm", region: "na", goals: ["g_sales", "g_ai"] }, edition: "max", task: "Pick an industry use case, start the real trial, complete the first-value steps." },
      { id: "FX-I", name: "Enterprise prospect", route: "#/recommend", ctx: { industry: "fs", size: "ent", region: "na", goals: ["g_sales", "g_service", "g_data"] }, task: "Understand fit without prices; reach Sales with context." },
      { id: "FX-H", name: "Enterprise seller", route: "#/seller", role: "seller", task: "Identify policy conflict in Scenario B; create review-ready comparison." }
    ],

    /* ── Content (PMM-editable, separate from commercial data, R30) ─ */
    copy: {
      hubTitle: "Find the right Salesforce plan",
      hubLead: "Answer a few questions, compare options and see what it could cost per month.", expect: "A high-level estimate using illustrative list prices. No discounts, and not a quote or a detailed configuration.",
      expandTitle: "Already a customer? Expand without starting over",
      expandLead: "Sign in to add seats or top up Flex Credits from your current contract.",
      honesty: "We show what we know, label what's estimated, and never show an unknown price as $0."
    }
  };

  /* ── Dates follow the real calendar (v5.2) ─────────────────────
     "today" is the viewer's local date. The synthetic contract is a
     12-month term that started on the 1st of the month 9 months ago, so
     about 2–3 months are always left, as in the original Nov 2 fixture
     (Feb 1 – Jan 31). Usage figures are the last 3 full months.
     FX.setToday("YYYY-MM-DD") re-derives everything (tests pin a date). */
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function iso(y, m, d) { var t = new Date(Date.UTC(y, m, d)); return t.toISOString().slice(0, 10); }
  FX.setToday = function (todayIso) {
    var p = todayIso.split("-"), y = +p[0], m = +p[1] - 1;
    var A = FX.account, C = A.credits;
    FX.meta.today = todayIso;
    A.termStart = iso(y, m - 9, 1);
    A.termEnd = iso(y, m + 3, 0);              // day before the 1st of the month 12 months after start
    C.expiry = A.termEnd;
    C.usedThrough = iso(y, m, 0);              // last day of the previous month
    C.burn = [3, 2, 1].map(function (k, i) { var d = new Date(Date.UTC(y, m - k, 1)); return { m: MON[d.getUTCMonth()], v: [150000, 160000, 170000][i] }; });
    var pd = new Date(Date.UTC(y, m - 9, 1) + 41 * 86400000);
    C.purchasedNote = "Pre-purchased " + pd.toISOString().slice(0, 10) + " (synthetic)";
    return FX;
  };
  var now = new Date();
  FX.setToday(iso(now.getFullYear(), now.getMonth(), now.getDate()));

  root.CEP_FX = FX;
  if (typeof module !== "undefined" && module.exports) module.exports = FX;
})(typeof window !== "undefined" ? window : globalThis);
