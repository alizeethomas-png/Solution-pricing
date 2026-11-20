# Commercial Entry Point Prototype v5 — Handoff

## v5.3: Portfolio 2.0 Product Explorer BOMs (Nov 20, 2026)

Edition catalog and pricing now follow the **Portfolio 2.0 Product Explorer**
(`docs/Portfolio-2.0-Product-Explorer/`), not legacy Enterprise/Unlimited
public-page prices.

- **Sales, Service and combined CRM** are the three Portfolio clouds: Core /
  Advanced / Max at **$195 / $395 / $550** (Sales or Service) and
  **$250 / $475 / $675** (Sales & Service). Combined is cheaper than buying
  both one-function SKUs.
- **Service Core is $195**, not $165. Flex Credits are **500K / 1M / 2.75M**
  at every Core / Advanced / Max tier, on every cloud.
- **Tableau Next is included** (Consumer + one Creator per org). It is not a
  standalone priced edition.
- Adding the other function to a one-cloud edition costs the **delta to the
  combined SKU** ($55 / $80 / $125), not a second full edition price.
- Agentforce for employees is included on **every Max** SKU (Sales, Service,
  Sales & Service).
- Industry and Field Service+ BOMs stay in the explorer reference; this
  prototype prices the core Portfolio clouds.
- The v3 **Solution Estimator** uses the same list prices. Sales + service
  goals recommend the combined SKU; stacking Sales and Service is priced at
  the combined delta, not two full editions. Tableau is extra licenses only.

---


## v5.2: dates follow the real calendar (Nov 19, 2026)

- **"Today" is now the viewer's local date,** detected when the page loads. It used to be fixed at Nov 2, 2026.
- **The synthetic contract moves with it.** It's a 12-month term that started on the 1st of the month nine months ago, so there are always about 2–3 months left. In November 2026 that's Feb 1, 2026 – Jan 31, 2027, the same as before.
- **Everything that depends on the date updates with it:**
  - days left in the term and the proration
  - the seats start date (it never sits in the past)
  - the Flex Credit forecast, run-out date and shortfall
  - when credits expire
  - the "last 3 months" usage labels and the "used through" date
- **What stays fixed:** the date the prices were read from salesforce.com (Oct 28), and the seller Commit policy dates.
- **Tests:** engine tests pin the date with `FX.setToday("2026-11-02")` so they stay stable.

## v5.1: proration made visible (Nov 19, 2026)

- **"$1,122 due now for 1 seat" was correct, but the screen didn't explain it.** The amount is prorated for the 91 days left in the term: 1 × $375/mo × 12 × 91/365, which is about 3 months.
  - The seat row, order summary, review and confirmation now say "for the 91 days (about 3.0 months) left, at $375/user/mo".
  - The summary note explains that the amount due covers the days left in the term.
  - "+1 seats" now reads "+1 seat".
- **Pricing cross-check:** no other mismatches were found. Checked:
  - 3,000 random estimates: monthly line items add up to the monthly total.
  - 120 rendered states: recommendation price = table price, and the estimate page total = the panel total = the line-item sum, in both monthly and annual views.
  - The order summary = review = confirmation.
  - Amount due = prorated seats + packs × $500.

## What changed from v4 (Nov 18, 2026)

- **List price next to contract rate (Leah).**
  - Existing-customer seat rows and the order review now show "List $395/user/mo · Your rate $375/user/mo". For Service Cloud Core it's "List $195 · Your rate $185". For Flex Credits it's "List $500 · Your rate $500 per 100K".
  - The negotiated rates are synthetic, about 5% below list. Proration and the ongoing cost use the contract rate.
  - The simulated price change is now $375 → $385.
- **Trailblazer ID-style sign-in (simulated).**
  - It's the same component for the customer sign-in page and the prospect Save, Compare, Download and Trial window.
  - The layout follows v8's Sales Room "Choose an account": Salesforce logo, a "Trailblazer ID sign-in (simulated)" label, account buttons (Google, Salesforce, MuleSoft, Spiff), then "Or", Business email, Password and a full-width Log in button.
  - Fine print: "Trailblazer account benefits". Prospects also get "Sign up for free", which switches to sign-up mode with name and company fields.
  - The password is kept, as requested.
- **Flex Credits at $500 per 100K, checked everywhere.**
  - Covered: agent usage on Customize, the existing-customer top-up and the editions card.
  - Usage needs are rounded up to whole 100K packs after included credits are subtracted, which is $0.005 per credit or about $0.10 per agent action.
  - Copy now says "at $500 each" and "$0.005 per credit".
  - 5 new engine tests (46 in total).
- **The Monthly/Annual switch has a note wherever it appears:** "Only changes how prices are shown. Billing is set by your contract or plan." Screen readers read the note with the switch.
- **Not changed:** the "Pricing Advisor" naming, as you decided.
- **Verification:** the engine tests pass. A click-through checks the note, $500 per pack, the Trailblazer ID sign-in on both paths, the list price vs. contract rate in the builder and review, and placing an order. A 500-state random check found nothing broken. The customer sign-in and order screens were checked visually at 1280px.

---

# v4 notes (kept for reference)

## v4.2 fixes

- **Nothing carries over between visits for people who aren't signed in.**
  - The working state (answers, estimate, cart, sign-in) now lives in sessionStorage, which clears when the browser tab or session ends. It used to be in localStorage.
  - Saved estimates belong to the simulated account. They're stored per email and come back only when that email signs in again. Signing out hides them.
  - Older prototype data left in localStorage is cleared on load.
- **"Your choice" only appears after the person actually picks an edition.** Until then, the selection follows the recommendation. Changing any answer resets it to the new recommendation.
- **The home subtitle** is now electric blue (#022AC0, the theme's link color) instead of the navy used for the title.

## What changed from v3 (Nov 10, 2026)

These changes follow the Romil/Christian review on Nov 9 and the decisions confirmed afterwards.

- **Home page:** one stacked section with no scrolling on desktop.
  - It shows the headline, the expectation line ("high-level estimate using illustrative list prices; no discounts; not a quote or a detailed configuration"), the "I'm new / I'm already a customer" switch, the 3 steps for the selected tab, and its button.
  - New tab: "Find my plan", plus a link "Know what you want? Compare packaged editions →". Customer tab: "Sign in to expand".
  - "Pick up where you left off" and "Already a customer? Sign in" are removed from the home page.
- **Resume:** Find my plan (`#/start`) shows only "Pick up where you left off" when there is saved progress, with "Continue where I left off" and "Start a new plan".
- **Navigation:**
  - The Pricing sub-menu is gone. "Products" in the global nav and the footer go to Compare packaged editions.
  - Every step has Back and Next. Steps: 1 About you → 2 Options → 3 Customize → 4 Next steps.
  - "My estimate" is no longer a separate stop. The running estimate is in the right panel from step 2 onward.
- **Step 1, About you:**
  - The order is now Region, Company size, Industry.
  - Cards are smaller.
  - Goals for your industry appear first under "Suggested for [industry]", with the rest under "Other goals". Nothing is hidden.
  - "Suggest goals" and "Skip questions" are removed. Next needs at least one goal.
- **Step 2, Options:**
  - A full-width "Why we recommend [edition]" blade shows the price per user (seat), goal coverage, the reasons and what else it would need.
  - Below it is one comparison table with a "★ Recommended" column label and "Choose … instead" links. The option cards and the "Browse all products" link are removed.
  - "Users (seats)" is used throughout.
- **Step 3, Customize:** the order is edition and users (seats), then the main number and line items, then add-ons, AI usage, buying model and assumptions.
- **Step 4, Next steps:** Start free trial, Talk to Sales (a slightly larger secondary button) and Save and compare.
  - Save, Compare, Download and Start free trial all open the same simulated "Sign in / Create account" dialog first.
  - For enterprise, Talk to Sales is the primary option.
- **Right panel:** a running estimate only, with the monthly/annual switch and "Start over". Try it, Talk to Sales and See full estimate are removed.
- **Compare packaged editions** (`#/editions`):
  - It opens with "Not sure which one? Find my plan".
  - Sections: For small businesses (Starter, Pro), Enterprise (Core, Advanced, Max) and AI agents (Agentforce): pay per user, or by usage with Flex Credits.
  - Each edition card has an "Estimate this edition" button that goes straight to step 3, and Back returns to the editions page.
  - Commerce Cloud is removed from this page because it's not a packaged edition.
- **Unchanged:** the large Talk to Sales for enterprise, the "Illustrative list price" label, the questions on one page, and the monthly/annual switch.
- **Future, needs data:** filtering options by region, then size, then industry.
- **Verification:** the 41 engine tests pass. A click-through confirmed each requested change, and a 500-state random check found no broken text or errors. Screens were checked at 1280px: home, About you, Options, Customize, Next steps and Editions. Home was also checked at 390px.

---

# v3 notes (kept for reference)

## What changed from v2 (Nov 4, 2026)

- **Expand my Salesforce is one order page.** After sign-in, the first screen asks how many seats and how many credits to add.
  - **Add seats:** each product has its own quantity stepper, with the prorated amount due now and the ongoing cost at today's rate. Products that can't be changed here say why and link to the account team.
  - **Top up Flex Credits:** the page shows the balance, average use, run-out date and shortfall. Buyers pick an amount: a suggested pack that covers the forecast, or 100K, 300K, 500K or 1M. The public calculator and buying model are folded away under "Not sure how many credits you need?".
  - **Seats and credits together:** a single "Your order" summary (a sticky rail on desktop, a bottom bar on mobile) totals both. The customer reviews once, places one order, and gets one confirmation.
  - Each issue is shown next to the item it affects. For example, missing wallet data only blocks credits, so seats can still be ordered. An admin who can't buy sends the whole order for approval.
  - Leaving the confirmation starts a fresh order. v2 kept showing the old confirmation, which hid the quantity screen.
  - `#/account/seats` and `#/account/credits` still work: they open the same page, scrolled to that section.
  - Engine: `cartQuote()`, covered by 7 new tests (41 in total).
- **Enterprise (1,000+ employees) has no estimates.**
  - The options page still shows what each option covers, what it needs and its limits. Prices become "Tailored", and the buttons become "Discuss [edition] with Sales".
  - `#/estimate` becomes "Let's build your pricing together". It lists what would be shared and what happens next, with a Talk to Sales button.
  - The plan summary, mobile bar, compare page and handoff show no prices. The handoff states that tailored pricing is being requested.
  - Product pages still show public list prices, with a note that enterprise pricing is tailored. New fixture: FX-I Enterprise prospect.
- **Layout fixes:**
  - Buttons and segmented controls now wrap instead of overflowing their cards.
  - Seller input fields no longer push their unit labels into the next column.
  - On mobile, the estimate table stacks instead of hiding the price column.
  - `/mo` stays on the same line as the amount.
  - Section headings in tables are left-aligned.
  - The "How it works" card text lines up with its title.
  - The plan summary is narrower on desktop, which gives option cards more room.
  - The price switch no longer wraps.
  - Anchored sections clear the sticky header.
- **Verification:** each screen was checked at 1280px and 390px: home, goals, options (including enterprise), estimate (including enterprise), compare, trial, Talk to Sales, the expand order page, review, the seller workspace and the research controls. A 400-state random check, a full click-through and the 41 engine tests all pass.

---

# v2 notes (kept for reference)

## What changed from v1 (Nov 3, 2026)

- **Intake order:** Region, then Industry, Company size and Goals. The lists stay the same length: 4 regions, 7 industries, 4 sizes and 7 goals.
- **Goals describe outcomes, not products:**
  - The Salesforce product icons are gone. Each goal has a plain outline icon instead.
  - Names and descriptions are rewritten as outcomes. For example, "Improve sales productivity" is now "Sell more efficiently", and "Put AI agents to work" is now "Automate routine requests".
  - The step explains that products are matched in the next step, with a reason for each one.
  - When an industry is selected, matching goals get a "Common in [industry]" tag.
  - The goal IDs and engine rules haven't changed.
- **Option cards** now open with "Covers X of N outcomes" before the price.
- **Try before you decide:**
  - The demo and the configured Agentforce concept are removed.
  - Each edition links to a real 30-day salesforce.com trial and lists what the trial includes:
    - Starter Suite: `/small-business/starter/free-trial/`
    - Pro Suite: `/small-business/pro-suite/`
    - Core: `/sales/free-trial/ee/`, a page still named "Enterprise Edition"
    - Advanced: `/sales/free-trial/ue/`, a page still named "Unlimited Edition"
    - Max: Salesforce has no public Max trial, so it opens the Advanced trial with a note
  - There are 3 use cases for each industry. When the buyer picks one, the real trial opens in a new tab and the first steps run on this page.
  - The page also offers a Service Cloud trial when service is part of the plan, and points to the industry trial org for Financial Services and Life Sciences.
  - "Have your own use case?" leads to Talk to Sales.
  - The use-case starters are labeled as a prototype concept.
- **Compare saved versions** now has the same rows as the side-by-side table at the Options step: price per user, how well each goal is covered (including through add-ons), add-ons, included Flex Credits, AI usage, Slack, billing, trial, limitations, software, usage, known total, services and items not priced. Rows that differ are highlighted, and there's a "Show only rows that differ" filter.
- **Expand my Salesforce** has a username and password form only. "Continue without signing in" and the seller option are removed. Researchers pick which test user the sign-in logs in as (authorized buyer or admin who can't buy) in Research controls. The seller workspace link stays in the footer under "Salesforce employees".
- **Prices show monthly by default, with a Monthly/Annual switch (v2.1):**
  - The switch appears in the plan summary, on the options page, the product page, the estimate total and the compare page. One setting applies everywhere in the session.
  - The switch only changes how prices are displayed, never the billing terms. Monthly = annual ÷ 12, and it's labeled "monthly equivalent, billed annually" unless the plan is actually billed monthly (Starter Suite on monthly billing). The other period is always shown beside it so the total is never hidden.
  - The line items, totals and ongoing seat cost follow the switch.
  - These stay as they are: one-time charges (prorated seats, Flex Credit packs, services ranges), credit allowances (per org per year), and the seller Commit workspace, which stays annual because it's internal deal planning.
- **Starting page (v2.2):** the two entry cards are replaced by one "How it works" section. It has a switch with two tabs, "I'm new to Salesforce" (shown first) and "I'm already a customer". Each tab shows its own 3 steps and button(s). The tabs work with the keyboard: arrow keys move between them. The hero keeps "Find my plan" as the main button and adds a line underneath: "Already a customer? Sign in to add seats or top up Flex Credits." Switching tabs is tracked as `context_changed {audience}`.
- **Fixes after a full review (v2.3):**
  - **Monthly/Annual switch:** it didn't change the per-user and per-unit prices, which are the large numbers on option cards, product tables, add-ons, line items, compare, account rates and seat rates. Now every recurring price follows the switch, for example $195/user/mo becomes $2,340/user/yr. The switch was also added to the account overview and the add-seats page.
  - **Clearer "partial total" messages:** they now say why the total is partial: not priced, not available with this edition, or a starting price. Before, they said "not priced" even when the only cause was a starting price.
  - **No empty coverage reasons:** option cards no longer leave a blank reason for some goals. Wording is now "goals" throughout.
  - **No internal wording on customer screens:** "Monetization validation" and "prototype fixture" were removed, and Max's limitations were rewritten.
  - **Add seats:** the ongoing cost is now "at today's rate", and renewal pricing is set when the customer renews. Before, it implied a guaranteed renewal price.
  - **Smaller fixes:** only the best-matching trial use case is highlighted. Product families without editions say "See pricing". The handoff shows quantities with their units. The billing control is labeled "How you're billed", so it doesn't get confused with the price-display switch.
- Research controls: the trial states are now "Trial unavailable" and "Trial already used".
- Saved state is stored under a new key (`cep.proto.v2`), so v1 and v2 don't share it.
- **Verification:** the 34 engine tests pass. An automated click-through found no errors in all flows, and it also checks the new requirements: intake order, no product icons in goals, no demo, custom use case present, full compare rows, and no extra sign-in options. The preview panel wouldn't load this folder, so v2 has **not been checked visually**. Please click through it in a browser.

---

This is a static HTML/CSS/JS prototype built to PRD v0.2 (Nov 2, 2026). There is no build step or server. Open `index.html` directly, or serve the folder with `python3 -m http.server`.

The brand layer comes from v8: DMS tokens, fonts, icons, `components.css`, and v8's `sx-` component styles (`css/sx.css`). The app itself is new. It is a single-page hash router with one shared context store.

## Routes

| Entry | Route | PRD flow |
|---|---|---|
| Hub | `#/` | Three entry points. The variant switch changes which button leads. |
| A — Explore | `#/explore` → `#/recommend` → `#/estimate` | F1, F3 (guided) |
| A — Browse | `#/browse` → `#/product?f=smb\|sales\|agentforce\|commerce` | F2 (product-led) |
| A — Compare saved | `#/compare` | R15 |
| A — Try | `#/try` | F4: real 30-day salesforce.com trials, industry use-case starters, own use case → Talk to Sales |
| A — Talk to Sales | `#/handoff` | F8: field preview, consent, decline, copy and download |
| B — Expand | `#/account` | Sign-in form only, then footprint and two equal cards |
| B — Add seats | `#/account/seats` | F5 |
| B — Top up Flex Credits | `#/account/credits` | F6, with the optional public calculator |
| C — Seller | `#/seller` | F7. Customer personas are blocked. |

## Research controls

To open the controls, use the footer link **Research controls** or press **Alt+Shift+R**. From there you can:

- Set the participant label.
- Start a new participant. This resets state and creates a new session ID.
- Switch the variant: guided (candidate) or product-led (control).
- Load any fixture from FX-A to FX-H.
- Choose the sign-in persona: authorized buyer or admin who can't buy.
- Inject a failure state: trial unavailable or already used; stale account data; sign-in failure; price change; order failure; no Digital Wallet; legacy credit type; unknown Commit drawdown; EUR contract; missing policy.
- Hide the synthetic services ranges (Q5).
- Export the PRD events as JSON. Events are stored locally only.

## Data

- **`js/fixtures.js`** holds all commercial data. Copy is kept separate in `FX.copy` (R30).
- **Public list prices** were read from salesforce.com on Oct 28, 2026 (the same set as v8). They are labeled illustrative.
- **Synthetic data:** the account, contracts, packs, proration, services ranges and the Commit policy are all invented.
- **`js/engine.js`** holds the deterministic rules. It never shows an unknown price as $0. Included credits and Agentforce are counted once, and add-ons are priced only after the buyer accepts them. Services are never added to the total. The account price fixture takes precedence over the list price.
- **Flex Credit calculator:** the CTA opens `https://www.salesforce.com/agentforce/pricing/calculator/` (its page title is "Flex Credit Pricing Calculator") in a new tab with no parameters. When the buyer returns, they type in the estimate. The prototype scales it to the remaining term, subtracts the available balance, and suggests a number of packs. It never orders automatically.
- **Trial links:** Starter Suite uses `salesforce.com/small-business/starter/free-trial/` and Pro Suite uses `salesforce.com/small-business/pro-suite/`.

## Verification

- `node tests/engine.test.js`: 34 tests pass. They cover R02–R11, R19, R26, R33, Commit rules, and a 1,000-run fuzz of the total invariants.
- A jsdom click-through of F1–F8, all eight fixtures and the failure states found no script errors and no "undefined", "NaN" or stray "$0" on screen.
- Visual check: v1 screens were checked at about 645px. **v2 has not been checked visually**, because the preview panel can't open this folder.

## Not done

- No screen-reader walkthrough and no full keyboard audit yet. Focus management, ARIA and 44px targets were designed in.
- USD only. Other regions and currencies show as unpriced on purpose (R29).
- Assistant goal mapping is keyword rules, not AI (R26).
- Monetization and Services have not validated the SKU mappings, Max entitlements, the rule that included credits are not stacked across editions, the services bands or the Commit policy.
