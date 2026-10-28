# Solution-Based Pricing — Prototype Handoff

A static, front-end-only prototype for user testing of a **solutions-based
pricing** experience for salesforce.com. It ships as **two versions behind a
selector**, for A/B-style testing.

- **No build step, no dependencies, no server-side code, no environment
  variables.** Plain HTML/CSS/JS. Deploy by serving this folder as static files.
- Total size ≈ **2.8 MB** (both versions + shared design-system assets).
- Background/strategy docs live one level up in the repo at `../../docs/`
  (`brief.md`, `decisions.md`, `references.md`) — context only, **not** part of
  the deployable.

---

## Quick start (run locally)

Any static file server works. From **this folder** (`pricing-landing/`):

```bash
# Option A — Python (no install)
python3 -m http.server 8000
#   → open http://localhost:8000/

# Option B — Node
npx serve .
#   → open the URL it prints

# Option C — VS Code / Cursor: "Live Server" extension → "Go Live"
```

Then open the site **root** (`/`) — that's the version selector.

> Opening `index.html` directly via `file://` also works (every path is
> relative; there is no `fetch()`, no ES modules, no `<base>` tag), but a local
> server is recommended and matches production behavior.

---

## Folder structure

```
pricing-landing/                ← deploy root (serve THIS folder)
├─ index.html                   ← ★ ENTRY POINT: version selector (V1 | V2)
├─ HANDOFF.md                   ← this file
├─ v1/                          ← V1 prototype (flow ends at Configure)
└─ v2/                          ← V2 prototype (full 5-step flow)

v1/ and v2/ are each a COMPLETE, self-contained copy of the prototype:

v2/
├─ index.html                   ← ★ V2 landing page (route root /v2/)
├─ product/index.html           ← "Pricing by Product" page
├─ industry/index.html          ← "Pricing by Industry" page
├─ solution/                    ← ★ build flow STARTS here (the "solve" screen)
│  ├─ index.html
│  ├─ solution.css
│  └─ solution.js
├─ estimator/                   ← the wizard (Discover → Configure → …)
│  ├─ index.html
│  ├─ estimator.css
│  └─ estimator.js              ← ★ wizard engine (step logic + breadcrumb)
├─ buying-models/               ← standalone Buying Models page (+ .css)
├─ calculator/                  ← standalone Calculator page (+ .css/.js)
├─ css/                         ← LOCAL styles (shared by this version's pages)
│  ├─ page.css                  ·  page-section styles
│  ├─ components.css            ·  reusable component library (.sf-card, CTAs…)
│  └─ icons-local.css           ·  local icon overrides
├─ js/                          ← LOCAL shared scripts
│  ├─ nav.js                    ·  top-nav behavior
│  └─ faq.js                    ·  FAQ accordion
└─ assets/
   ├─ brand/                    ·  Salesforce logo + social icons
   ├─ product-icons/            ·  per-product glyphs
   ├─ industry-icons/           ·  per-industry glyphs
   ├─ buying-model-icons/       ·  buying-model PNGs
   └─ dms/                      ← VENDORED Salesforce design system (see notes)
      ├─ tokens.css             ·  design tokens (colors, type, spacing)
      ├─ fonts.css + fonts/     ·  self-hosted brand webfonts
      ├─ icons.css + images/    ·  mask-image icon set
```

`v1/` is byte-for-byte identical to `v2/` **except** for the V1 flow branch
(see next section).

---

## Entry points (where each flow starts)

| Route | File | What it is |
|---|---|---|
| `/` | `index.html` | **Selector.** Two cards → V1 / V2. Users land here first. |
| `/v1/` | `v1/index.html` | **V1** landing → nav, Product/Industry, build flow. |
| `/v2/` | `v2/index.html` | **V2** landing → the full experience. |
| build flow start | `{v1,v2}/solution/index.html` | The "solve" screen that opens the flow. |
| wizard engine | `{v1,v2}/estimator/estimator.js` | Step order, breadcrumb, CTAs. |

Each of the three `index.html` files opens with a `★ ENTRY POINT` banner comment
so they're greppable (`grep -rn "ENTRY POINT"`). The `solution → estimator`
handoff passes state purely via URL query string (`?g=<goal indices>&q=<text>`)
— there is **no** localStorage/session/cookie state anywhere.

---

## V1 vs V2 — the only difference

Both versions are the same prototype. V1 changes **one thing**, confined to the
"Build Your Salesforce Solution" flow:

| | V2 (full) | V1 (branched) |
|---|---|---|
| Flow steps | Solutions → Discover → Configure → Buying Models → Estimate | Solutions → Discover → **Configure (final)** |
| Configure CTA | "Continue" (advances) | **"Contact Specialist"** (placeholder, gated) |
| Breadcrumb | 5 steps | 3 steps |

**Exactly three files differ between `v1/` and `v2/`:**

1. `estimator/estimator.js` — 3-step breadcrumb; Configure CTA → `goContact()`.
2. `solution/index.html` — static breadcrumb trimmed to 3 steps.
3. `index.html` — the identifying `★ ENTRY POINT` banner (V1 vs V2 text).

Verify anytime with: `diff -qr v1 v2`.

> **Forking note (as requested):** because each version is a full copy, V2 is
> structurally guaranteed unaffected by V1 edits. The components that *carry*
> the divergence — and that would have needed forking if a single shared tree
> had been used — are **`estimator/estimator.js`** and **`solution/index.html`**.
> Everything else (all CSS/JS/assets) is identical; the CTA change is a
> label/action swap and the breadcrumb count is data-driven, so no CSS forked.

---

## Configuration / environment

**None.** No env vars, no API keys, no build config, no `package.json`, no
runtime. It is static files. Nothing to set before deploying.

---

## ⚠️ Placeholders / TODOs to fill before going live

| # | Where | What to supply |
|---|---|---|
| 1 | `{v1,v2}/product/index.html` and `industry/index.html` — Explore cards | Each "See pricing" link is `href="#"`. Set real per-product / per-industry pricing URLs. |
| 2 | `{v1,v2}/estimator/estimator.js` → `PROD_URLS` map | 12 products, all `"#"`. Add each product's "Learn about…" info-page URL. (Console logs a reminder for any left as `#`.) |
| 3 | `v1/estimator/estimator.js` → `goContact()` | V1's "Contact Specialist" CTA is a **no-op placeholder**. Decide its destination. *(V2's Estimate step already links to `https://www.salesforce.com/company/contact-us/` — you may want to reuse that.)* |
| 4 | Global nav + footer (every page) | Top nav (Products, Industries, Customers, Events, Learning, Support, Company, Login, Get started) and footer social links are `href="#"` — intentional prototype chrome. Wire only if the test needs a functional global nav. |
| 5 | `{v1,v2}/calculator/` and `{v1,v2}/buying-models/` | Deliberately scaffolded ("results coming soon" / placeholder cards). Flesh out only if in scope. |

**Not a TODO — the signature gradient is pure CSS** (`linear-gradient(180deg,
#90D0FE 0%, #EAF5FE 100%)`), not a reference image. Nothing to supply there.

The only real external URL in the whole package is
`https://www.salesforce.com/company/contact-us/` (V2 Estimate). Everything else
marked above is `#`.

---

## Intentional states (not bugs — don't "fix" blindly)

- **V1 estimator keeps unreachable step code.** Steps 3–6 (`rFlex`,
  `rBuyModel`, `rAgreement`, `rEstimate`), `goFromProds()`, and the full
  step→stage map are retained so the v1/v2 engines stay aligned. See the
  `V1 FORK` comment in `v1/estimator/estimator.js`. Deleting `rEstimate` would
  break the `fns[step]||rEstimate` fallback — leave it.
- **Vendored `assets/dms/icons.css` declares the full DMS icon set (~992 mask
  classes)**, but only the icons actually used were vendored into
  `assets/dms/images/icons/`. Unused classes point at absent SVGs — but since no
  element ever carries those classes, the browser never requests them (a
  `mask-image` only loads when an element matches). No 404s in practice; leave
  the bundle intact.

---

## Cleanup performed in this handoff pass

- **Removed orphaned assets** (both versions): `assets/product-icons/canvas.svg`,
  `assets/product-icons/analytics.svg`, and a stray `assets/figma/` export.
- **Removed dev scratch**: the package-level `.agents/` folder (SVG-tooling
  Python scripts — not part of the experience).
- **Removed dead CSS** from both `css/page.css`: `.hero-back-link` (orphaned by
  an earlier change) and `.solution-advisor` (a built-but-never-wired
  component). Recoverable from git history if wanted.
- **Added** the entry-point banner comments and the V1-fork note above.

Integrity at handoff: all relative HTML paths resolve (0 broken); every used
icon glyph has its SVG present.

---

## Deploy notes

- **Static host**, any provider (Netlify, Vercel, GitHub Pages, S3/CloudFront,
  Heroku static buildpack…). Set the **publish/root directory to this folder**
  (`pricing-landing/`); the default document is `index.html` (the selector).
- No redirects/rewrites needed — it's a real multi-page site (every link is a
  real file), so no SPA fallback required.
- The selector (`/index.html`) pulls its brand font + logo from `v2/` (to avoid
  triplicating fonts). Keep `v1/`, `v2/`, and `index.html` together as one unit.
- Git lives at the **repo root one level up**; there is no `.git` inside this
  folder, so a zip of `pricing-landing/` stays clean.

### Ready to ship

The package is self-contained and complete — nothing is in a temporary or
half-finished state. To export:

```bash
# from prototype/  (one level up from here)
zip -r solution-based-pricing-prototype.zip pricing-landing \
    -x '*.DS_Store'
```
