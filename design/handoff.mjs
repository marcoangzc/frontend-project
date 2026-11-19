// Builds a hand-off pack for writing the project report:
//   design/handoff/QuickServe-UI-summary.md   text summary (process, design system, every state, rules, testing)
//   design/handoff/QuickServe-UI-screens.pdf  one screenshot per state, grouped by role and screen
// Run after `node design/build.mjs`:  node design/handoff.mjs
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import customer from './src/customer.mjs';
import staff from './src/staff.mjs';
import owner from './src/owner.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'handoff');
const shots = join(out, '.shots');
mkdirSync(shots, { recursive: true });

const roles = [
  { title: 'Customer', sub: 'No login. Each QR code opens one short flow on the customer\'s own phone (360 px wide).', sections: customer },
  { title: 'Cashier, waiter and kitchen', sub: 'Cashier role on a phone or counter tablet. The kitchen wall tablet signs in with a staff account and shows only the kitchen view.', sections: staff },
  { title: 'Owner back office', sub: 'Owner role on a PC (1280 px wide). The owner can also open every front-of-house page.', sections: owner },
];
const screens = roles.reduce((a, r) => a + r.sections.length, 0);
const states = roles.reduce((a, r) => a + r.sections.reduce((b, s) => b + s.frames.length, 0), 0);
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/* ---------- 1. screenshots ---------- */
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
await page.goto(pathToFileURL(join(here, 'index.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => {
  document.getElementById('board').classList.remove('fit');
  document.querySelectorAll('.states').forEach((s) => { s.style.overflow = 'visible'; s.style.width = 'max-content'; });
});
const devs = await page.$$('.dev');
if (devs.length !== states) throw new Error(`expected ${states} frames, found ${devs.length}`);
for (let k = 0; k < devs.length; k++) await devs[k].screenshot({ path: join(shots, `${String(k).padStart(3, '0')}.png`) });

/* ---------- 2. PDF ---------- */
let k = 0;
const fig = (f) => {
  const img = pathToFileURL(join(shots, `${String(k++).padStart(3, '0')}.png`)).href;
  return `<figure class="${f.kind}"><figcaption>${f.name}</figcaption><img src="${img}" alt="${f.name}">${f.note ? `<p>${f.note}</p>` : ''}</figure>`;
};
const pdfHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>QuickServe UI screens</title><style>
@page { size: A4 landscape; margin: 10mm 12mm; }
* { box-sizing: border-box; } body { font: 10pt/1.4 -apple-system, 'Segoe UI', Roboto, 'Noto Sans', sans-serif; color: #1C1C1E; margin: 0; }
.cover { height: 186mm; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
.cover h1 { font-size: 30pt; margin: 0 0 6mm; } .cover p { font-size: 12pt; color: #48484A; max-width: 200mm; margin: 0 0 3mm; }
h2 { font-size: 16pt; margin: 0 0 1mm; } .role { font-size: 11pt; color: #0062E6; font-weight: 700; margin: 0; } .meta { color: #6E6E73; margin: 0 0 4mm; }
section { page-break-before: always; } .grid { display: flex; flex-wrap: wrap; gap: 6mm 5mm; align-items: flex-start; }
figure { margin: 0; break-inside: avoid; } figcaption { font-weight: 700; margin-bottom: 1.5mm; }
figure img { display: block; width: 100%; border: 0.3mm solid #C7C7CC; border-radius: 1.5mm; }
figure p { color: #48484A; font-size: 8.5pt; margin: 1.5mm 0 0; }
figure.ph { width: 62mm; } figure.ph img { max-height: 150mm; object-fit: contain; object-position: top; }
figure.pc, figure.tb, figure.ct { width: 200mm; } figure.pc img, figure.tb img, figure.ct img { max-height: 140mm; object-fit: contain; object-position: left top; }
</style></head><body>
<div class="cover"><h1>QuickServe UI screens</h1>
<p>Browser-based POS for small family-run Malaysian restaurants. ${screens} screens and ${states} states across three roles, drawn in Bootstrap 5 with Bootstrap Icons.</p>
<p>Each page shows one screen with all of its states. The grey line under a state says what triggers it.</p>
<p>Version 3.2, ${new Date().toISOString().slice(0, 10)}. Food images are flat illustrations standing in for the photos merchants upload; QR codes are placeholders.</p></div>
${roles.map((r) => r.sections.map((s) => `<section><p class="role">${r.title}</p><h2>${s.title}</h2><p class="meta">${s.meta}</p><div class="grid">${s.frames.map(fig).join('')}</div></section>`).join('')).join('')}
</body></html>`;
const pdfSrc = join(shots, 'print.html');
writeFileSync(pdfSrc, pdfHtml);
await page.goto(pathToFileURL(pdfSrc).href);
await page.waitForLoadState('load');
await page.pdf({ path: join(out, 'QuickServe-UI-screens.pdf'), format: 'A4', landscape: true, printBackground: true });
await browser.close();

/* ---------- 3. Markdown summary ---------- */
const list = roles.map((r) => `### ${r.title}\n\n${r.sub}\n\n` + r.sections.map((s) => `#### ${s.title}\n\n*${s.meta}* · ${s.frames.length} states\n\n` + s.frames.map((f) => `- **${f.name.replace(/^.*? · /, '')}**${f.note ? `: ${strip(f.note)}` : ''}`).join('\n')).join('\n\n')).join('\n\n');

const md = `# QuickServe UI design: summary for the project report

Version 3.2 · ${new Date().toISOString().slice(0, 10)} · ${screens} screens, ${states} states

This file summarises the UI/UX design work for QuickServe, a browser-based POS for small family-run Malaysian restaurants (2 to 5 staff, about 30 tables). It goes with **QuickServe-UI-screens.pdf**, which has a screenshot of every state listed below. The source of every screen is in \`design/src/\` in the repository.

## 1. Scope

| Role | Logs in | Device | What they do |
|---|---|---|---|
| Customer | No (QR links only) | Own phone, 360 px | Join the walk-in queue, browse the menu, order, pay, split the bill |
| Cashier / waiter | Yes, Cashier role | Phone, or tablet at the counter | Confirm QR orders, watch tables, run the queue, take cash, request voids, add dish photos |
| Kitchen | Staff account, kitchen view only | Wall tablet, read from a metre away | See confirmed orders oldest first, mark served, record waste |
| Owner | Yes, Owner role | PC or tablet | Menu, recipes, inventory, tables and QR, vouchers, staff, settings, reports, void approval |

Out of scope, as in the brief: customer accounts, takeaway and delivery, reservations, printers, native apps.

## 2. Design process

1. **Brief.** Started from the QuickServe UI Design Brief (users, flows, screens table, business rules, visual rules, avoid list).
2. **First pass in Figma.** Colour variables, text styles, Bootstrap Icons components and the first customer screens were built in Figma. The Figma Starter plan limits (3 pages per file and a cap on automated design calls) stopped this part.
3. **Design board in HTML.** The screens were redrawn as static Bootstrap 5 markup, so every screen can be built exactly as drawn and opened in any browser. A small Node script builds the board from the screen definitions.
4. **Review with UI/UX guidance.** Two popular open-source design skills were used as references: *ui-ux-pro-max* (its restaurant and food-service guidance, colour and font data, and pre-delivery checklist) and *frontend-design*. Its advice that food apps should avoid "muted colours and low energy" matched the first round of feedback.
5. **Iterations from feedback.** The main rounds were:
   - **Typeface.** A consistent typeface replaced the system font, which showed as Microsoft YaHei on Chinese Windows.
   - **Colour and icons.** Colour, icon tiles and food category icons made the screens less plain.
   - **Button hierarchy.** One solid main action per screen; secondary actions became light grey.
   - **Queue page.** Simplified, using a real restaurant queue page as a reference.
   - **Light-grey app style.** The page turns bright teal when the customer is called.
   - **Apple-style palette.** iOS system blue with Apple Settings-style icon tiles, chosen from a comparison of four palettes.
   - **New business rules and screens.** Queue removal, party limit, waste recording, dish photos and staff photo permission.
6. **Acceptance testing.** After every change, automated checks ran over every state (section 6), and the six key flows were walked through step by step.

## 3. Design system

**Colour**

| Token | Value | Use |
|---|---|---|
| Brand (buttons, links, selected) | #0062E6 | iOS blue, Apple's increased-contrast shade; 5.4:1 with white text |
| Brand tint (icons, soft backgrounds) | #007AFF, #EAF3FF | Icons and light fills only |
| Background | #F2F2F7 | Apple grouped background; cards are white |
| Text / secondary text | #1C1C1E / #6E6E73 | Secondary text is at least 4.5:1 on white and on the background |
| Waiting (amber) | #FFCC00, #FFF3CD, text #664D03 | Only waiting states: pending confirmation, waiting for food, waiting for payment, unclaimed portions |
| Error and low stock (red) | #DC3545 / #FF3B30 | Errors, low stock and destructive buttons (reject, leave queue, approve void) |
| Called (bright teal) | #2DD4BF with text #04312B | The whole queue page when the customer's table is ready |
| Icon tiles | Blue, teal, green, orange, brown, mint | One fixed colour per meaning (orders blue, tables teal, queue orange, sales green, stock brown); decorative, always beside a text label |

**Type.** SF on iPhone and Mac, Inter (embedded) elsewhere. Phone text is never under 14 px. Prices and counts use tabular figures.

**Shape and size.** Two radii: 10 px for controls, 16 px for cards. Every tappable control on a phone is at least 44 px tall. Phone screens are 360 px wide.

**Components.** Built from Bootstrap 5 components and Bootstrap Icons:
- **Buttons:** primary (solid blue), secondary (light grey), danger (red).
- **Form fields:** label above, error message under the field.
- **Lists, cards and tables.**
- **Alerts:** each carries an icon tile.
- **Bottom sheets and dialogs.**
- **Steppers:** the + or − button disables at its limit.
- **Status badges.**
- **Polling cue:** an "Updated just now" line on live pages.

## 4. Screens and states

${list}

## 5. Business rules decided during design

These change or add to the brief. They need team agreement and backend support.

1. **Queue removal.** Staff can remove a waiting ticket at any time, with a reason (left, took two numbers, asked to cancel, other). A removed ticket can be restored to its old place within 15 minutes. No-show can be marked right after calling; the 5-minute hold only keeps the table and no longer blocks calling the next group.
2. **Queue presence.** The ticket page already polls every 5 seconds, so the server records when each ticket was last seen. Tickets whose page has been closed for 20 minutes (owner setting) are flagged on the staff Queue page. When two groups are ahead, the customer is asked "Are you still here?".
3. **No sound on the queue page.** When called, the whole page turns bright teal and Android phones vibrate. iPhone browsers cannot vibrate, so staff should also call the number aloud.
4. **Party size limit.** It follows the largest table in Table setup (now 8 seats) instead of a fixed number. The owner can set their own limit.
5. **Waste and extra use.** The kitchen records waste (dropped, spoiled, burnt, dish remade, extra in a dish, optionally linked to an order). Each ingredient has a full stock history: recipe deductions, waste, stock-in and stock-take differences. Repeated extra use on one dish suggests fixing that recipe.
6. **Dish photos.** Photos are optional. They are shrunk in the browser before upload: about 10 KB thumbnails for the list and about 60 KB for the dish detail, stored in Supabase Storage. Text loads first and photos fill in.
7. **Staff photo permission.** Cashiers can add or replace dish photos from their phone, but cannot change names, prices or recipes. The owner can switch this off or require approval before photos go live. The backend should expose photo upload as its own endpoint.
8. **Visual rules.** The brief asked for one brand colour and a system font. The approved style uses iOS blue with decorative icon colours, and SF or Inter.

## 6. Acceptance testing

**Method.** Automated checks ran in a real browser (Playwright and Chromium) over all ${states} states after every change:

| Check | How it is measured | Result |
|---|---|---|
| Text size on phones | Every text element is at least 14 px | 0 failures |
| Touch targets on phones | Every button, link, field and tab is at least 44 px tall | 0 failures |
| Text contrast (WCAG 2.1 AA) | Text colour against the real background behind it: 4.5:1, or 3:1 for large text | 0 failures |
| Covered elements | 5 sample points on every text and icon, checking nothing else (including decorative lines) is painted over them | 0 failures |
| Clipped content | Nothing cut off by its container or sticking out of the screen | 0 failures |
| Wrapped labels | Button, badge, tab and chip labels stay on one line | 0 failures |
| Squeezed text | No text box crushed narrower than about one character | 0 failures |
| Avoid list | No gradients, purple or indigo colours, or emoji used as icons | 0 found |
| Colour use | Every use of red and amber was listed and checked against the colour rules | Passed |
| Typeface | Rendered font family of every text element | One family |
| Page layout | The board at 400 px and 1440 px, light and dark theme | No sideways scroll |

The colour comparison page was checked the same way for 4 palettes × 2 icon styles.

**Problems found and fixed by testing:**
- Four 36 px buttons on phones.
- A few low-contrast labels.
- An order-status line drawn over its step dots.
- A cramped "Add photo" button.

**UX walkthrough.** The six key flows from the brief were walked through as a first-time user of each role: walk-in queue, QR ordering with staff confirmation, payment, split bill, stock deduction and low stock, and void approval. It looked at whether the next step is clear, whether errors can be recovered, and whether mistakes can be undone. Missing states were added:
- Customer side: rejected order, order changed by staff.
- Undo and confirmation: kitchen undo, leave-queue confirmation.
- Errors: expired voucher, duplicate split name.
- Staff alerts: new-order banner, choosing dishes to mark unavailable.
- Other: table detail on the phone, queue removal and restore, waste recording, photo upload.

**Known limitations**
- Not yet checked on real phones. iPhone fonts could not be seen in the test browser.
- QR codes are placeholders, and food images are illustrations.
- The brief's step of offering two layout directions per screen was done for colour (four palettes compared) but not for layout.
- Without sound, customers may miss being called if they are not looking at the page.

## 7. Next steps

1. **Agree the rules.** The team agrees the rules in section 5 and updates the brief.
2. **Design the data and APIs.** Design the database tables (Supabase PostgreSQL) and the API list (Express) from these screens.
3. **Build feature by feature, backend and frontend together:**
   1. Login and roles
   2. Tables and QR
   3. Menu and photos
   4. QR ordering, staff confirmation and the kitchen
   5. Stock deduction and waste
   6. Payment and e-receipt
   7. Queue
   8. Split bill
   9. Reports
4. **Test together.** Run integration tests on real phones and tablets.
`;
writeFileSync(join(out, 'QuickServe-UI-summary.md'), md);
rmSync(shots, { recursive: true, force: true });
console.log(`${screens} screens, ${states} states -> design/handoff/QuickServe-UI-summary.md, QuickServe-UI-screens.pdf`);
