# TAKEOVER — site-v3 (brofixapp.com)
Last updated: 2026-11-22 15:30 · branch `main` @ `f77f2c8`

## Goal
Public site for the Brofix app: the legal pages Google OAuth and the Play/App Store listings need (home, privacy, account deletion), plus a product site Eran can send to customers and pros. Hebrew first, English too, light and dark.

## Done (evidence)
- Domain brofixapp.com bought 2026-10-22 (Vercel, DNS in Vercel: 4 A records to GitHub Pages + `www` CNAME). Verified in Google Search Console (TXT record in Vercel DNS, do not remove).
- Site v3 live (commit `1ae60da`), approved by Eran: design C (amber, hex-nut motif) + phone with moving pro dot (A) + scroll reveal (B).
- Deploy: GitHub Actions `.github/workflows/pages.yml` builds `dist/` with `node build.mjs` + `node scripts/check.mjs`; Pages `build_type=workflow`, HTTPS enforced. Run 39792904872 succeeded.
- Live check: `/`, `/pros`, `/privacy`, `/delete-account`, `/accessibility`, the same under `/en/`, `/privacy-en` (full page, used by store declarations), `/sitemap.xml`, `/robots.txt` all 200; unknown path 404; http→https 301.
- Legal text: privacy controllers are the three founders (ערן דוד צארום, חושן נוסבאום / Choshen Nusbaum, נווה בר חמה); button label "יוצא/ת לדרך" / "Heading out"; brand "Brofix". Same text in the app's legal drafts (synced to the app by the builder session, PR #41).

## Where we stopped
Site is live and complete. 2026-10-22: Eran decided the drawn app screens stay; no real screenshots needed.
Pros lead form live on /pros#join (Web3Forms, key in `build.mjs` FORM_KEY, leads to brofixapp@gmail.com). Privacy policy covers it (commit ad3fe32), 12-month retention enforced by the Apps Script in `docs/gmail-lead-retention.gs`, installed on brofixapp@gmail.com with a daily trigger. App-side sync of the policy is with the builder session (after its PR #47).

2026-10-23: founders' feedback + brand round live on main (`c9f1b66`):
- /terms he+en, with TERMS_he.md v1.0 final in drafts/legal.
- Accessibility coordinator added.
- /pros recruit page: benefit strip, license box for electrical/gas/pest control, 12 hex trades + 25 more, form with trade + city.
- Home fixes.
- Charcoal/white palette (dark mode #262626).
- Wrench in the header, footer and hero (faded, 130%, mirrored in Hebrew).
- Wrench loosens a nut on scroll.
- The WhatsApp button is built but hidden until `WA_NUMBER` in build.mjs is set.

2026-11-14: Pages config had been deleted (site 404); re-enabled (build_type=workflow, cname brofixapp.com), Eran confirmed. App Store link live (PR #1, `124eedb`): https://apps.apple.com/il/app/id6824639001. Google Play badge still "בקרוב".
2026-11-14: app 1.4.0 privacy/store draft at `BroFix/drafts/legal/CHANGES_1.4.0_proposal.md`, approved by Eran 15.11 ("מאשר פרטיות"); site branch feat/privacy-1.2, merge only when 1.4.0 ships and set the effective date to the real ship date.

2026-11-22: privacy + terms v1.2 LIVE (PR #2, e2da682), effective 22.11.2026; Google Play link live (PR #3). Audit fixes mockup approved with changes (https://claude.ai/artifact/HeirTVp6j3JwxCr9sbFxpB): Eran keeps map, hero caption (no chip) and pilot badge as today; approves dark band (#141414 + amber borders in dark). Canary not needed (template is Vercel-only).
2026-11-22: audit fixes LIVE (PR #4, f77f2c8). Teaser video is music only, no captions needed.
2026-11-22: external ratings (ADR-054, Google + מדרג) as a /pros reason to join. Mockup https://claude.ai/artifact/DzfQTqZPT4Zx5zKkcLdgpr (before / A perk line / B section with sample quote card / A+B; recommended A+B). Builder session confirmed 22.11: shipped in 1.4.0 (PR #113, iOS + Android live, DB deployed 18.11); facts checked on app main: Google + Midrag, ownership check usually up to 2 business days, at least 5 reviews, quote card shows them until 5 Brofix ratings, profile keeps them. Blind mutual rating and price-change-needs-customer-approval are in the app (ratingsCustomer.sheet, ADR-023). Eran: "תבנה" (A+B + 6 perks, no extra cards). Site never names Midrag (competitor; Eran 22.11); the app side (pro declares the Midrag numbers, no Midrag link to customers) is the builder session branch feat/midrag-declared. Not using "nobody else does this" (unverifiable).

## Next steps
1. External ratings on /pros: after Eran picks a variant and the builder confirms ship timing and facts, build he+en, pr-gate --engine claude, merge on Eran's "merge".
2. en /pros "Join the pilot" still says Google Play internal testing / TestFlight: stale, ask Eran.
0. WhatsApp: when Eran sends the number, set `WA_NUMBER` in build.mjs (digits with 972), build, check, push.
1. Google Play link (https://play.google.com/store/apps/details?id=com.brofix.mobile) when the stores session says Production is approved; same swap as PR #1.
1b. 1.4.0 policy: after Eran approves + builder answers, apply section A to `src/pages/*/privacy.html` (v1.2), PR via pr-gate; then PRIVACY_POLICY_he.md/_en.md for the builder's sync-legal.
2. Terms page: done 2026-10-23. Any later legal change goes to the site and to drafts/legal, then the builder runs sync-legal.

## Open decisions
- Pilot data resale: needs separate consent + policy section + Amendment 13 check before any collection.
- Terms v1.0 published for the pilot (Eran, 2026-10-23); lawyer review when the company is founded.

## Owner to-dos
- Send the WhatsApp number for the /pros button.

## Rules that applied
- Never edit the app's production repo; legal text changes go to the site and to the legal drafts, then tell the builder session to sync.
- Legal wording changes need Eran's explicit OK; ask before DNS, deploy or spend.
- No personal names outside the privacy pages; brand "Brofix"; Eran's surname צארום.
- Zero npm deps, no external requests; every page exists in he and en; `scripts/check.mjs` gate must pass.

## Not mine (left alone)
None.
