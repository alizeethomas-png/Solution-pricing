/* ══════════════════════════════════════════════════════════════════
   industry-suites.js — v3-only Portfolio 2.0 industry suite catalog.
   Generated from docs/Portfolio-2.0-Product-Explorer (read-only).
   Plain script (no ES modules). Loaded before engine.js.
   Default cloud is Sales & Service (crm). Variant defaults match
   the explorer: Growth (not Advanced package), not MP, Standard
   Nonprofit Core.
   ══════════════════════════════════════════════════════════════════ */
(function (root) {
  "use strict";
  /**
   * @typedef {Object} SuitePrice
   * @property {string} label
   * @property {number} price
   * @typedef {Object} SuiteTier
   * @property {number} price
   * @property {string} name
   * @property {string} family
   * @property {string} blurb
   * @property {string[]} includes
   * @property {string} slack
   * @property {number} credits
   * @property {string} storage
   * @property {string} [variant]
   * @property {SuitePrice[]} [prices]
   */
  var SU = {
  "meta": {
    "source": "Portfolio 2.0 Product Explorer",
    "asOf": "2026-11-20",
    "defaultCloud": "crm",
    "notes": {
      "ls": "Life Sciences Sales and Service are Max only; Core and Advanced are sold as Sales & Service.",
      "auto": "Automotive Sales and Service are Max only; Core and Advanced are sold as Sales & Service.",
      "edu": "Education Sales and Service are Max only; Core and Advanced are sold as Sales & Service.",
      "np": "Nonprofit Sales and Service are Max only; Core and Advanced are sold as Sales & Service. Dual commercial / nonprofit list prices.",
      "ps": "Public Sector is Service only in this explorer (no Sales or Sales & Service SKUs).",
      "comms": "Communications Core/Advanced default to the Growth package (not Advanced package, not MP).",
      "media": "Media Core/Advanced default to the Growth package (not Advanced package, not MP).",
      "eu": "Energy & Utilities Sales Core/Advanced are MP-only SKUs; default view still shows those SKUs."
    }
  },
  "clouds": [
    {
      "id": "sales",
      "label": "Sales"
    },
    {
      "id": "service",
      "label": "Service"
    },
    {
      "id": "crm",
      "label": "Sales & Service"
    }
  ],
  "industries": [
    {
      "id": "fsc",
      "name": "Financial Services",
      "suite": "Financial Services Cloud",
      "icon": "financial-services",
      "common": [
        "g_service",
        "g_data",
        "g_sales"
      ],
      "industryTrial": "Financial Services"
    },
    {
      "id": "health",
      "name": "Health",
      "suite": "Health Cloud",
      "icon": "healthcare",
      "common": [
        "g_service",
        "g_data",
        "g_ai"
      ]
    },
    {
      "id": "ls",
      "name": "Life Sciences",
      "suite": "Life Sciences Cloud",
      "icon": "healthcare-lifesciences",
      "common": [
        "g_service",
        "g_data",
        "g_ai"
      ],
      "industryTrial": "Life Sciences"
    },
    {
      "id": "auto",
      "name": "Automotive",
      "suite": "Automotive Cloud",
      "icon": "automotive",
      "common": [
        "g_sales",
        "g_integrate",
        "g_service"
      ]
    },
    {
      "id": "mfg",
      "name": "Manufacturing",
      "suite": "Manufacturing Cloud",
      "icon": "manufacturing",
      "common": [
        "g_sales",
        "g_integrate",
        "g_service"
      ]
    },
    {
      "id": "cg",
      "name": "Consumer Goods",
      "suite": "Consumer Goods Cloud",
      "icon": "consumer-goods",
      "common": [
        "g_commerce",
        "g_market",
        "g_service"
      ]
    },
    {
      "id": "comms",
      "name": "Communications",
      "suite": "Communications Cloud",
      "icon": "communications",
      "common": [
        "g_service",
        "g_sales",
        "g_data"
      ]
    },
    {
      "id": "media",
      "name": "Media",
      "suite": "Media Cloud",
      "icon": "communications-media",
      "common": [
        "g_service",
        "g_sales",
        "g_market"
      ]
    },
    {
      "id": "eu",
      "name": "Energy & Utilities",
      "suite": "Energy & Utilities Cloud",
      "icon": "energy-utilities",
      "common": [
        "g_service",
        "g_integrate",
        "g_data"
      ]
    },
    {
      "id": "edu",
      "name": "Education",
      "suite": "Education Cloud",
      "icon": "education",
      "common": [
        "g_service",
        "g_data",
        "g_sales"
      ]
    },
    {
      "id": "ps",
      "name": "Public Sector",
      "suite": "Public Sector",
      "icon": "public-sector",
      "common": [
        "g_service",
        "g_data",
        "g_ai"
      ]
    },
    {
      "id": "np",
      "name": "Nonprofit",
      "suite": "Nonprofit Cloud",
      "icon": "nonprofit",
      "common": [
        "g_sales",
        "g_service",
        "g_data"
      ]
    }
  ],
  "credits": {
    "core": 500000,
    "advanced": 1000000,
    "max": 2750000
  },
  "storage": {
    "core": "20MB / user",
    "advanced": "1GB / user",
    "max": "1GB / user"
  },
  "blurbs": {
    "core": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
    "advanced": "Offload more to AI agents, with the insight and control to trust what it does.",
    "max": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely."
  },
  "suites": {
    "core": {
      "sales": {
        "core": {
          "price": 195,
          "includes": [
            "Sales Cloud - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provisioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Sales Core",
          "family": "Sales (Portfolio 2.0)",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Sales Core BOM"
        },
        "advanced": {
          "price": 395,
          "includes": [
            "Sales Cloud - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Salesforce Foundations",
            "Data Cloud Provisioning"
          ],
          "slack": "Slack Business+",
          "name": "Sales Advanced",
          "family": "Sales (Portfolio 2.0)",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Sales Advanced BOM"
        },
        "max": {
          "price": 550,
          "includes": [
            "Sales Cloud - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Salesforce Foundations",
            "Data Cloud Provisioning"
          ],
          "slack": "Slack Business+",
          "name": "Sales Max",
          "family": "Sales (Portfolio 2.0)",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Sales Max BOM"
        }
      },
      "service": {
        "core": {
          "price": 195,
          "includes": [
            "Service Cloud - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provisioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Service Core",
          "family": "Service (Portfolio 2.0)",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Service Core BOM"
        },
        "advanced": {
          "price": 395,
          "includes": [
            "Service Cloud - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Salesforce Foundations",
            "Data Cloud Provisioning"
          ],
          "slack": "Slack Business+",
          "name": "Service Advanced",
          "family": "Service (Portfolio 2.0)",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Service Advanced BOM"
        },
        "max": {
          "price": 550,
          "includes": [
            "Service Cloud - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Help Agent Access",
            "AI Agents for Employees Add-on - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Salesforce Foundations",
            "Data Cloud Provisioning"
          ],
          "slack": "Slack Business+",
          "name": "Service Max",
          "family": "Service (Portfolio 2.0)",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Service Max BOM"
        }
      },
      "crm": {
        "core": {
          "price": 250,
          "includes": [
            "Sales & Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provisioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Sales & Service Core",
          "family": "Sales & Service (Portfolio 2.0)",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "CRM Sales & Service Core BOM"
        },
        "advanced": {
          "price": 475,
          "includes": [
            "Sales & Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Salesforce Foundations",
            "Data Cloud Provisioning"
          ],
          "slack": "Slack Business+",
          "name": "Sales & Service Advanced",
          "family": "Sales & Service (Portfolio 2.0)",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "CRM Sales & Service Advanced BOM"
        },
        "max": {
          "price": 675,
          "includes": [
            "Sales Cloud - Agentforce 1 Edition",
            "Service Cloud - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "CSI Score (fka Cross-Cloud CSI)",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Help Agent Access",
            "AI Agents for Employees Add-on - Unlimited Edition",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Salesforce Foundations",
            "Data Cloud Provisioning"
          ],
          "slack": "Slack Business+",
          "name": "Sales & Service Max",
          "family": "Sales & Service (Portfolio 2.0)",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "CRM Sales & Service Max BOM"
        }
      }
    },
    "fsc": {
      "sales": {
        "core": {
          "price": 325,
          "includes": [
            "Financial Services Cloud - Sales - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Core",
          "family": "Financial Services Cloud · Sales",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Financial Services Cloud - Sales - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Financial Services Cloud - Sales - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Insurance Brokerage User Add-on",
            "Collections and Financial Recovery",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Advanced",
          "family": "Financial Services Cloud · Sales",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Financial Services Cloud - Sales - Advanced Edition 2.0"
        },
        "max": {
          "price": 700,
          "includes": [
            "Financial Services Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Insurance Brokerage User Add-on",
            "Collections and Financial Recovery",
            "Digital Insurance - Unlimited Edition",
            "Digital Origination - Unlimited Edition",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Max",
          "family": "Financial Services Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Financial Services Cloud - Sales - Max Edition 2.0"
        }
      },
      "service": {
        "core": {
          "price": 325,
          "includes": [
            "Financial Services Cloud - Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Core",
          "family": "Financial Services Cloud · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Financial Services Cloud - Service - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Financial Services Cloud - Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Insurance Brokerage User Add-on",
            "Collections and Financial Recovery",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Advanced",
          "family": "Financial Services Cloud · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Financial Services Cloud - Service - Advanced Edition 2.0"
        },
        "max": {
          "price": 700,
          "includes": [
            "Financial Service Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Insurance Brokerage User Add-on",
            "Collections and Financial Recovery",
            "Digital Insurance - Unlimited Edition",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Max",
          "family": "Financial Services Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Financial Services Cloud - Service - Max Edition 2.0"
        }
      },
      "crm": {
        "core": {
          "price": 350,
          "includes": [
            "Financial Services Cloud - Sales & Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Core",
          "family": "Financial Services Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Financial Services Cloud - CRM - Core Edition 2.0"
        },
        "advanced": {
          "price": 525,
          "includes": [
            "Financial Services Cloud - Sales & Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Insurance Brokerage User Add-on",
            "Collections and Financial Recovery",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Advanced",
          "family": "Financial Services Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Financial Services Cloud - CRM - Advanced Edition 2.0"
        },
        "max": {
          "price": 725,
          "includes": [
            "Financial Services Cloud - Sales - Agentforce 1 Edition",
            "Financial Service Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Insurance Brokerage User Add-on",
            "Collections and Financial Recovery",
            "Digital Insurance - Unlimited Edition",
            "Digital Origination - Unlimited Edition",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Financial Services Max",
          "family": "Financial Services Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Financial Services Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "health": {
      "sales": {
        "core": {
          "price": 325,
          "includes": [
            "Health Cloud - Sales - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Health Core",
          "family": "Health Cloud · Sales",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Health Cloud - Sales - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Health Cloud - Sales - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Health Advanced",
          "family": "Health Cloud · Sales",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Health Cloud - Sales - Advanced Edition 2.0"
        },
        "max": {
          "price": 700,
          "includes": [
            "Health Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Digital Insurance - Unlimited Edition",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Health Max",
          "family": "Health Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Health Cloud - Sales - Max Edition 2.0"
        }
      },
      "service": {
        "core": {
          "price": 325,
          "includes": [
            "Health Cloud - Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Health Core",
          "family": "Health Cloud · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Health Cloud - Service - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Health Cloud - Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Health Advanced",
          "family": "Health Cloud · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Health Cloud - Service - Advanced Edition 2.0"
        },
        "max": {
          "price": 700,
          "includes": [
            "Health Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Digital Insurance - Unlimited Edition",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Health Max",
          "family": "Health Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Health Cloud - Service - Max Edition 2.0"
        }
      },
      "crm": {
        "core": {
          "price": 350,
          "includes": [
            "Health Cloud - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Health Core",
          "family": "Health Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Health Cloud - CRM - Core Edition 2.0"
        },
        "advanced": {
          "price": 525,
          "includes": [
            "Health Cloud - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Health Advanced",
          "family": "Health Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Health Cloud - CRM - Advanced Edition 2.0"
        },
        "max": {
          "price": 725,
          "includes": [
            "Health Cloud - Sales - Agentforce 1 Edition",
            "Health Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Digital Insurance - Unlimited Edition",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Health Max",
          "family": "Health Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Health Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "ls": {
      "sales": {
        "max": {
          "price": 700,
          "includes": [
            "Life Sciences Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Revenue Cloud Advanced - Unlimited Edition"
          ],
          "slack": "Slack Business+",
          "name": "Life Sciences Max",
          "family": "Life Sciences Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Life Sciences Cloud - Sales - Max Edition 2.0"
        }
      },
      "service": {
        "max": {
          "price": 700,
          "includes": [
            "Life Sciences Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Revenue Cloud Advanced - Unlimited Edition"
          ],
          "slack": "Slack Business+",
          "name": "Life Sciences Max",
          "family": "Life Sciences Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Life Sciences Cloud - Service - Max Edition 2.0"
        }
      },
      "crm": {
        "core": {
          "price": 350,
          "includes": [
            "Life Sciences Cloud - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Revenue Cloud Advanced - Unlimited Edition",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Life Sciences Core",
          "family": "Life Sciences Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Life Sciences Cloud - CRM - Core Edition 2.0"
        },
        "advanced": {
          "price": 525,
          "includes": [
            "Life Sciences Cloud - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Revenue Cloud Advanced - Unlimited Edition"
          ],
          "slack": "Slack Business+",
          "name": "Life Sciences Advanced",
          "family": "Life Sciences Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Life Sciences Cloud - CRM - Advanced Edition 2.0"
        },
        "max": {
          "price": 725,
          "includes": [
            "Life Sciences Cloud - Sales - Agentforce 1 Edition",
            "Life Sciences Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Revenue Cloud Advanced - Unlimited Edition"
          ],
          "slack": "Slack Business+",
          "name": "Life Sciences Max",
          "family": "Life Sciences Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Life Sciences Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "auto": {
      "sales": {
        "max": {
          "price": 700,
          "includes": [
            "Automotive Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Digital Insurance - Unlimited Edition",
            "Digital Origination - Unlimited Edition",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Automotive Max",
          "family": "Automotive Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Automotive Cloud - Sales - Max Edition 2.0"
        }
      },
      "service": {
        "max": {
          "price": 700,
          "includes": [
            "Automotive Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Digital Insurance - Unlimited Edition",
            "Connected Vehicle - Unlimited Edition (10K)",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Automotive Max",
          "family": "Automotive Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Automotive Cloud - Service - Max Edition 2.0"
        }
      },
      "crm": {
        "core": {
          "price": 300,
          "includes": [
            "Automotive Cloud - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Automotive Core",
          "family": "Automotive Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Automotive Cloud - CRM - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Automotive Cloud - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Automotive Advanced",
          "family": "Automotive Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Automotive Cloud - CRM - Advanced Edition 2.0"
        },
        "max": {
          "price": 725,
          "includes": [
            "Automotive Cloud - Sales - Agentforce 1 Edition",
            "Automotive Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Digital Insurance - Unlimited Edition",
            "Digital Origination - Unlimited Edition",
            "Connected Vehicle - Unlimited Edition (10K)",
            "Industries Seed Credit Pack"
          ],
          "slack": "Slack Business+",
          "name": "Automotive Max",
          "family": "Automotive Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Automotive Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "mfg": {
      "sales": {
        "core": {
          "price": 275,
          "includes": [
            "Manufacturing Cloud - Sales - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Core",
          "family": "Manufacturing Cloud · Sales",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Manufacturing Cloud - Sales - Core Edition 2.0"
        },
        "advanced": {
          "price": 450,
          "includes": [
            "Manufacturing Cloud - Sales - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Advanced",
          "family": "Manufacturing Cloud · Sales",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Manufacturing Cloud - Sales - Advanced Edition 2.0"
        },
        "max": {
          "price": 650,
          "includes": [
            "Manufacturing Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Max",
          "family": "Manufacturing Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Manufacturing Cloud - Sales - Max Edition 2.0"
        }
      },
      "service": {
        "core": {
          "price": 275,
          "includes": [
            "Manufacturing Cloud - Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Core",
          "family": "Manufacturing Cloud · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Manufacturing Cloud - Service - Core Edition 2.0"
        },
        "advanced": {
          "price": 450,
          "includes": [
            "Manufacturing Cloud - Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Advanced",
          "family": "Manufacturing Cloud · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Manufacturing Cloud - Service - Advanced Edition 2.0"
        },
        "max": {
          "price": 650,
          "includes": [
            "Manufacturing Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Field Service - Field Technician - Unlimited Edition",
            "Field Service - Dispatcher - Unlimited Edition",
            "Appointment Assistant",
            "Connected Assets - Unlimited Edition (10K)"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Max",
          "family": "Manufacturing Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Manufacturing Cloud - Service - Max Edition 2.0"
        }
      },
      "crm": {
        "core": {
          "price": 300,
          "includes": [
            "Manufacturing Cloud - Sales & Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Core",
          "family": "Manufacturing Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Manufacturing Cloud - CRM - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Manufacturing Cloud - Sales & Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Advanced",
          "family": "Manufacturing Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Manufacturing Cloud - CRM - Advanced Edition 2.0"
        },
        "max": {
          "price": 700,
          "includes": [
            "Manufacturing Cloud - Sales - Agentforce 1 Edition",
            "Manufacturing Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Field Service - Field Technician - Unlimited Edition",
            "Field Service - Dispatcher - Unlimited Edition",
            "Appointment Assistant",
            "Connected Assets - Unlimited Edition (10K)"
          ],
          "slack": "Slack Business+",
          "name": "Manufacturing Max",
          "family": "Manufacturing Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Manufacturing Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "cg": {
      "sales": {
        "core": {
          "price": 275,
          "includes": [
            "Consumer Goods Cloud - Sales - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Document Generation",
            "Core Pricing (Rev Cloud)",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Core",
          "family": "Consumer Goods Cloud · Sales",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Consumer Goods Cloud - Sales - Core Edition 2.0"
        },
        "advanced": {
          "price": 450,
          "includes": [
            "Consumer Goods Cloud - Sales - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation",
            "Core Pricing (Rev Cloud)"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Advanced",
          "family": "Consumer Goods Cloud · Sales",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Consumer Goods Cloud - Sales - Advanced Edition 2.0"
        },
        "max": {
          "price": 700,
          "includes": [
            "Consumer Goods Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation",
            "Core Pricing (Rev Cloud)"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Max",
          "family": "Consumer Goods Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Consumer Goods Cloud - Sales - Max Edition 2.0"
        }
      },
      "service": {
        "core": {
          "price": 275,
          "includes": [
            "Consumer Goods Cloud - Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Core Pricing (Rev Cloud)",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Core",
          "family": "Consumer Goods Cloud · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Consumer Goods Cloud - Service - Core Edition 2.0"
        },
        "advanced": {
          "price": 450,
          "includes": [
            "Consumer Goods Cloud - Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Core Pricing (Rev Cloud)"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Advanced",
          "family": "Consumer Goods Cloud · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Consumer Goods Cloud - Service - Advanced Edition 2.0"
        },
        "max": {
          "price": 700,
          "includes": [
            "Consumer Goods Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Core Pricing (Rev Cloud)",
            "Field Service - Field Technician - Unlimited Edition",
            "Field Service - Dispatcher - Unlimited Edition",
            "Appointment Assistant",
            "Connected Assets - Unlimited Edition (10K)",
            "Asset Service Lifecycle Management - Unlimited Edition"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Max",
          "family": "Consumer Goods Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Consumer Goods Cloud - Service - Max Edition 2.0"
        }
      },
      "crm": {
        "core": {
          "price": 300,
          "includes": [
            "Consumer Goods Cloud - Sales & Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Document Generation",
            "Core Pricing (Rev Cloud)",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Core",
          "family": "Consumer Goods Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Consumer Goods Cloud - CRM - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Consumer Goods Cloud - Sales & Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation",
            "Core Pricing (Rev Cloud)"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Advanced",
          "family": "Consumer Goods Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Consumer Goods Cloud - CRM - Advanced Edition 2.0"
        },
        "max": {
          "price": 725,
          "includes": [
            "Consumer Goods Cloud - Sales - Agentforce 1 Edition",
            "Consumer Goods Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation",
            "Core Pricing (Rev Cloud)",
            "Field Service - Field Technician - Unlimited Edition",
            "Field Service - Dispatcher - Unlimited Edition",
            "Appointment Assistant",
            "Asset Service Lifecycle Management - Unlimited Edition",
            "Connected Assets - Unlimited Edition (10K)"
          ],
          "slack": "Slack Business+",
          "name": "Consumer Goods Max",
          "family": "Consumer Goods Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Consumer Goods Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "comms": {
      "sales": {
        "core": {
          "price": 300,
          "includes": [
            "Communications Cloud Growth - Sales - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Communications Core",
          "family": "Communications Cloud · Sales",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Communications Cloud Growth - Sales - Core Edition 2.0",
          "variant": "Growth"
        },
        "advanced": {
          "price": 475,
          "includes": [
            "Communications Cloud Growth - Sales - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Communications Advanced",
          "family": "Communications Cloud · Sales",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Communications Cloud Growth - Sales - Advanced Edition 2.0",
          "variant": "Growth"
        },
        "max": {
          "price": 800,
          "includes": [
            "Communications Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Communications Max",
          "family": "Communications Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Communications Cloud - Sales - Max Edition 2.0",
          "variant": "Standard"
        }
      },
      "service": {
        "core": {
          "price": 300,
          "includes": [
            "Communications Cloud Growth - Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Communications Core",
          "family": "Communications Cloud · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Communications Cloud Growth - Service - Core Edition 2.0",
          "variant": "Growth"
        },
        "advanced": {
          "price": 475,
          "includes": [
            "Communications Cloud Growth - Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Communications Advanced",
          "family": "Communications Cloud · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Communications Cloud Growth - Service - Advanced Edition 2.0",
          "variant": "Growth"
        },
        "max": {
          "price": 800,
          "includes": [
            "Communications Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Communications Max",
          "family": "Communications Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Communications Cloud - Service - Max Edition 2.0",
          "variant": "Standard"
        }
      },
      "crm": {
        "core": {
          "price": 325,
          "includes": [
            "Communications Cloud Growth - Sales & Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Communications Core",
          "family": "Communications Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Communications Cloud Growth - CRM - Core Edition 2.0",
          "variant": "Growth"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Communications Cloud Growth - Sales & Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Communications Advanced",
          "family": "Communications Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Communications Cloud Growth - CRM - Advanced Edition 2.0",
          "variant": "Growth"
        },
        "max": {
          "price": 825,
          "includes": [
            "Communications Cloud - Sales - Agentforce 1 Edition",
            "Communications Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Communications Max",
          "family": "Communications Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Communications Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "media": {
      "sales": {
        "core": {
          "price": 300,
          "includes": [
            "Media Cloud Growth - Sales - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Media Core",
          "family": "Media Cloud · Sales",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Media Cloud Growth - Sales - Core Edition 2.0",
          "variant": "Growth"
        },
        "advanced": {
          "price": 475,
          "includes": [
            "Media Cloud Growth - Sales - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Media Advanced",
          "family": "Media Cloud · Sales",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Media Cloud Growth - Sales - Advanced Edition 2.0",
          "variant": "Growth"
        },
        "max": {
          "price": 800,
          "includes": [
            "Media Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Media Max",
          "family": "Media Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Media Cloud - Sales - Max Edition 2.0",
          "variant": "Standard"
        }
      },
      "service": {
        "core": {
          "price": 300,
          "includes": [
            "Media Cloud Growth - Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Media Core",
          "family": "Media Cloud · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Media Cloud Growth - Service - Core Edition 2.0",
          "variant": "Growth"
        },
        "advanced": {
          "price": 475,
          "includes": [
            "Media Cloud Growth - Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Media Advanced",
          "family": "Media Cloud · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Media Cloud Growth - Service - Advanced Edition 2.0",
          "variant": "Growth"
        },
        "max": {
          "price": 800,
          "includes": [
            "Media Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Media Max",
          "family": "Media Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Media Cloud - Service - Max Edition 2.0",
          "variant": "Standard"
        }
      },
      "crm": {
        "core": {
          "price": 325,
          "includes": [
            "Media Cloud Growth - Sales & Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Media Core",
          "family": "Media Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Media Cloud Growth - CRM - Core Edition 2.0",
          "variant": "Growth"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Media Cloud Growth - Sales & Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Media Advanced",
          "family": "Media Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Media Cloud Growth - CRM - Advanced Edition 2.0",
          "variant": "Growth"
        },
        "max": {
          "price": 825,
          "includes": [
            "Media Cloud - Sales - Agentforce 1 Edition",
            "Media Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Media Max",
          "family": "Media Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Media Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "eu": {
      "sales": {
        "core": {
          "price": 250,
          "includes": [
            "Energy & Utilities Cloud - Sales - Enterprise Edition - MP",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Core",
          "family": "Energy & Utilities Cloud · Sales",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Energy & Utilities Cloud - Sales - Core Edition - MP 2.0",
          "variant": "MP"
        },
        "advanced": {
          "price": 425,
          "includes": [
            "Energy & Utilities Cloud - Sales - Unlimited Edition - MP",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Advanced",
          "family": "Energy & Utilities Cloud · Sales",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Energy & Utilities Cloud - Sales - Advanced Edition - MP 2.0",
          "variant": "MP"
        },
        "max": {
          "price": 650,
          "includes": [
            "Energy & Utilities Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Max",
          "family": "Energy & Utilities Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Energy & Utilities Cloud - Sales - Max Edition 2.0",
          "variant": "Standard"
        }
      },
      "service": {
        "core": {
          "price": 250,
          "includes": [
            "Energy & Utilities Cloud - Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Core",
          "family": "Energy & Utilities Cloud · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Energy & Utilities Cloud - Service - Core Edition 2.0",
          "variant": "Standard"
        },
        "advanced": {
          "price": 425,
          "includes": [
            "Energy & Utilities Cloud - Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Advanced",
          "family": "Energy & Utilities Cloud · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Energy & Utilities Cloud - Service - Advanced Edition 2.0",
          "variant": "Standard"
        },
        "max": {
          "price": 650,
          "includes": [
            "Energy & Utilities Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Field Service+ for Energy & Utilities Cloud - Unlimited Edition",
            "Appointment Assistant",
            "Connected Assets - Unlimited Edition (10K)"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Max",
          "family": "Energy & Utilities Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Energy & Utilities Cloud - Service - Max Edition 2.0",
          "variant": "Standard"
        }
      },
      "crm": {
        "core": {
          "price": 325,
          "includes": [
            "Energy & Utilities Cloud - Sales & Service - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Core",
          "family": "Energy & Utilities Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Energy & Utilities Cloud - CRM - Core Edition 2.0",
          "variant": "Standard"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Energy & Utilities Cloud - Sales & Service - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Advanced",
          "family": "Energy & Utilities Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Energy & Utilities Cloud - CRM - Advanced Edition 2.0",
          "variant": "Standard"
        },
        "max": {
          "price": 700,
          "includes": [
            "Energy & Utilities Cloud - Sales - Agentforce 1 Edition",
            "Energy & Utilities Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Field Service+ for Energy & Utilities Cloud - Unlimited Edition",
            "Appointment Assistant",
            "Connected Assets - Unlimited Edition (10K)"
          ],
          "slack": "Slack Business+",
          "name": "Energy & Utilities Max",
          "family": "Energy & Utilities Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Energy & Utilities Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "edu": {
      "sales": {
        "max": {
          "price": 700,
          "includes": [
            "Education Cloud - Sales - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation"
          ],
          "slack": "Slack Business+",
          "name": "Education Max",
          "family": "Education Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Education Cloud - Sales - Max Edition 2.0"
        }
      },
      "service": {
        "max": {
          "price": 700,
          "includes": [
            "Education Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation"
          ],
          "slack": "Slack Business+",
          "name": "Education Max",
          "family": "Education Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Education Cloud - Service - Max Edition 2.0"
        }
      },
      "crm": {
        "core": {
          "price": 350,
          "includes": [
            "Education Cloud - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Document Generation",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Education Core",
          "family": "Education Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Education Cloud - CRM - Core Edition 2.0"
        },
        "advanced": {
          "price": 525,
          "includes": [
            "Education Cloud - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation"
          ],
          "slack": "Slack Business+",
          "name": "Education Advanced",
          "family": "Education Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Education Cloud - CRM - Advanced Edition 2.0"
        },
        "max": {
          "price": 725,
          "includes": [
            "Education Cloud - Sales - Agentforce 1 Edition",
            "Education Cloud - Service - Agentforce 1 Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center",
            "Document Generation"
          ],
          "slack": "Slack Business+",
          "name": "Education Max",
          "family": "Education Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Education Cloud - CRM - Max Edition 2.0"
        }
      }
    },
    "ps": {
      "sales": {},
      "service": {
        "core": {
          "price": 275,
          "includes": [
            "Public Sector Foundation - Advanced - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Public Sector Core",
          "family": "Public Sector · Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Public Sector - Service - Core Edition 2.0"
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Public Sector Foundation - Advanced - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Public Sector Advanced",
          "family": "Public Sector · Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Public Sector - Service - Advanced Edition 2.0"
        },
        "max": {
          "price": 650,
          "includes": [
            "Public Sector - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Public Sector Max",
          "family": "Public Sector · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Public Sector - Service - Max Edition 2.0"
        }
      },
      "crm": {}
    },
    "np": {
      "sales": {
        "max": {
          "price": 570,
          "includes": [
            "Nonprofit Cloud - Sales - Agentforce 1 Edition",
            "Sales Emails",
            "Account Research",
            "Enablement - Enterprise Edition",
            "Salesforce Maps Advanced",
            "Agentforce Contact Center - Digital",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect"
          ],
          "slack": "Slack Business+",
          "name": "Nonprofit Max",
          "family": "Nonprofit Cloud · Sales",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Nonprofit Cloud - Sales - Max Edition 2.0",
          "prices": [
            {
              "label": "Commercial",
              "price": 570
            },
            {
              "label": "Nonprofit",
              "price": 285
            }
          ]
        }
      },
      "service": {
        "max": {
          "price": 570,
          "includes": [
            "Nonprofit Cloud - Service - Agentforce 1 Edition",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Nonprofit Max",
          "family": "Nonprofit Cloud · Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Nonprofit Cloud - Service - Max Edition 2.0",
          "prices": [
            {
              "label": "Commercial",
              "price": 570
            },
            {
              "label": "Nonprofit",
              "price": 285
            }
          ]
        }
      },
      "crm": {
        "core": {
          "price": 280,
          "includes": [
            "Nonprofit Cloud - Enterprise Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Sales Emails",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Premier Success Plan - Salesforce Platform"
          ],
          "slack": "Slack Business+",
          "name": "Nonprofit Core",
          "family": "Nonprofit Cloud · Sales & Service",
          "blurb": "Start getting value from AI fast, right where your team already works, with expert guidance to help it stick.",
          "credits": 500000,
          "storage": "20MB / user",
          "tab": "Nonprofit Cloud - CRM - Core Edition 2.0",
          "variant": "Standard",
          "prices": [
            {
              "label": "Commercial",
              "price": 280
            },
            {
              "label": "Nonprofit",
              "price": 70
            }
          ]
        },
        "advanced": {
          "price": 500,
          "includes": [
            "Nonprofit Cloud - Unlimited Edition",
            "Slack Business+",
            "Tableau Next Consumer",
            "Tableau Next Creator (one per org)",
            "Customer Signals Intelligence",
            "Enablement - Enterprise Edition",
            "Sales Insights",
            "Sales Emails",
            "Account Research",
            "Help Agent Access",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Nonprofit Advanced",
          "family": "Nonprofit Cloud · Sales & Service",
          "blurb": "Offload more to AI agents, with the insight and control to trust what it does.",
          "credits": 1000000,
          "storage": "1GB / user",
          "tab": "Nonprofit Cloud - CRM - Advanced Edition 2.0",
          "prices": [
            {
              "label": "Commercial",
              "price": 500
            },
            {
              "label": "Nonprofit",
              "price": 125
            }
          ]
        },
        "max": {
          "price": 690,
          "includes": [
            "Nonprofit Cloud - Sales - Agentforce 1 Edition",
            "Nonprofit Cloud - Service - Agentforce 1 Edition",
            "Sales Emails",
            "Account Research",
            "Enablement - Enterprise Edition",
            "Salesforce Maps Advanced",
            "Cross Cloud CSI",
            "Agentforce Contact Center - Workforce Management - Unlimited Edition",
            "Agentforce Contact Center - Digital",
            "Quality Management",
            "Advanced Momentum",
            "Salesforce Foundations",
            "Data Cloud Provsioning",
            "Help Agent Access",
            "Salesforce Contracts - Unlimited Edition",
            "Salesforce Back Up and Recover - Data (1 GB)",
            "Salesforce Back Up and Recover - Files (1 GB)",
            "Salesforce Archive - Data (1 GB)",
            "Salesforce Archive - Files (1 GB)",
            "Data Detect",
            "Security Center"
          ],
          "slack": "Slack Business+",
          "name": "Nonprofit Max",
          "family": "Nonprofit Cloud · Sales & Service",
          "blurb": "Give every person in your business AI without limits, and the governance to bring in any other agent, securely.",
          "credits": 2750000,
          "storage": "1GB / user",
          "tab": "Nonprofit Cloud - CRM - Max Edition 2.0",
          "prices": [
            {
              "label": "Commercial",
              "price": 690
            },
            {
              "label": "Nonprofit",
              "price": 345
            }
          ]
        }
      }
    }
  }
};

  var TIER_OF = { core: "core", adv: "advanced", max: "max", svc_core: "core", svc_adv: "advanced", svc_max: "max", crm_core: "core", crm_adv: "advanced", crm_max: "max" };
  var CLOUD_EDS = {
    sales: ["core", "adv", "max"],
    service: ["svc_core", "svc_adv", "svc_max"],
    crm: ["crm_core", "crm_adv", "crm_max"]
  };

  function industry(id) {
    if (!id) return null;
    for (var i = 0; i < SU.industries.length; i++) if (SU.industries[i].id === id) return SU.industries[i];
    return null;
  }
  function cloud(id) {
    for (var i = 0; i < SU.clouds.length; i++) if (SU.clouds[i].id === id) return SU.clouds[i];
    return null;
  }
  function tierKey(edId) { return TIER_OF[edId] || "core"; }
  function edsFor(cloudId) { return (CLOUD_EDS[cloudId] || CLOUD_EDS.crm).slice(); }
  function suiteBlock(indId, cloudId) {
    var pack = SU.suites[indId] || SU.suites.core;
    return (pack && pack[cloudId]) || {};
  }
  function tier(indId, cloudId, edOrTier) {
    var k = TIER_OF[edOrTier] || edOrTier;
    var block = suiteBlock(indId && SU.suites[indId] ? indId : "core", cloudId || "crm");
    return block[k] || null;
  }
  function has(indId, cloudId, edOrTier) {
    var k = TIER_OF[edOrTier] || edOrTier;
    if (indId && SU.suites[indId]) {
      var pack = SU.suites[indId][cloudId || "crm"];
      return !!(pack && pack[k]);
    }
    return !!tier(indId, cloudId, edOrTier);
  }

  SU.TIER_OF = TIER_OF;
  SU.CLOUD_EDS = CLOUD_EDS;
  SU.industry = industry;
  SU.cloud = cloud;
  SU.tierKey = tierKey;
  SU.edsFor = edsFor;
  SU.tier = tier;
  SU.has = has;

  root.CEP_SUITES = SU;
  if (typeof module !== "undefined" && module.exports) module.exports = SU;
})(typeof window !== "undefined" ? window : globalThis);
