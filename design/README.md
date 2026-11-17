# QuickServe UI screens

All screens and states from the QuickServe UI Design Brief, drawn as static Bootstrap 5 markup with Bootstrap Icons, plus an acceptance report (UI against the brief, UX walkthrough, automated checks) at the top of the page.

- Open `index.html` in a browser to view the board (self-contained, no network needed).
- `src/customer.mjs`, `src/staff.mjs`, `src/owner.mjs` hold the screens; `src/lib.mjs` the shared helpers; `src/qs.css` the theme (tokens at the top); `src/report.mjs` the acceptance report.
- Typeface: Plus Jakarta Sans (SIL Open Font License, see `vendor/plus-jakarta-sans-LICENSE.txt`), embedded at build time.
- Rebuild after editing: `node design/build.mjs`

QR codes are placeholders, not scannable codes.
