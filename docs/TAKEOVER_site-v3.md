# TAKEOVER — site-v3 (brofixapp.com)
Last updated: 2026-10-22 17:30 · branch `main` @ `1ae60da`

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

## Next steps
1. Store links: swap the "בקרוב" spans for links in `src/pages/*/index.html` and `pros.html` once Play / App Store URLs exist.
2. Terms page (`/terms`, he+en) once Eran approves the terms text.

## Open decisions
- Terms text: not approved yet · options: publish draft / wait for lawyer · recommendation: wait for lawyer review.

## Owner to-dos
- Approve terms text when ready.

## Rules that applied
- Never edit the app's production repo; legal text changes go to the site and to the legal drafts, then tell the builder session to sync.
- Legal wording changes need Eran's explicit OK; ask before DNS, deploy or spend.
- No personal names outside the privacy pages; brand "Brofix"; Eran's surname צארום.
- Zero npm deps, no external requests; every page exists in he and en; `scripts/check.mjs` gate must pass.

## Not mine (left alone)
None.
