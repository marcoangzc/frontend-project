# QuickServe UI design: summary for the project report

Version 3.3 · 2026-11-19 · 25 screens, 124 states

This file summarises the UI/UX design work for QuickServe, a browser-based POS for small family-run Malaysian restaurants (2 to 5 staff, about 30 tables). It goes with **QuickServe-UI-screens.pdf**, which has a screenshot of every state listed below. The source of every screen is in `design/src/` in the repository.

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
6. **Revision v3.3 from the project report.** The report became the source of truth:
   - **Shorter text.** Every screen's text was cut for a lunch rush: one message per state, hints of 8 words or fewer, errors as "what is wrong + how to fix it", dialog titles as questions. Explanations moved to the design notes.
   - **Removed.** The language switcher (the system is English only).
   - **Queue page.** The customer ticket shows groups ahead, with no wait estimate.
   - **Membership.** An email field and a full membership points flow were added.
   - **Defects fixed.** Best sellers are ranked by quantity sold, and vouchers are deactivated instead of deleted.
   - **New screens.** Added for the report's test plan, each with a valid and an invalid run: cancel order, refund, add ingredient, staff account, voucher form, member edit and deactivate, and call waiter.
7. **Acceptance testing.** After every change, automated checks ran over every state (section 6), and the six key flows were walked through step by step.

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

### Customer

No login. Each QR code opens one short flow on the customer's own phone (360 px wide).

#### Join queue

*Customer, phone · Table module (Clement)* · 2 states

- **Form**: Opened by the queue QR at the door. No login, one task on the screen. Party size uses + and − instead of typing, so it can't be left empty or set to 0.
- **Party size invalid (over the limit)**: The limit comes from the largest table in Table setup (T13, 8 seats), or from the owner's own limit in Settings, so it changes when tables change. The + button stops at the limit, so an invalid number can't be entered; the message says what to do instead.

#### My ticket

*Customer, phone · Table module (Clement)* · 7 states

- **Waiting**: Only what the customer needs: their number, party size and how many groups are queuing. No other tickets are listed. The count refreshes by polling within 5 s.
- **Edit pax**: Party size can change while waiting. The place in the queue stays the same.
- **Leave the queue?**: Leaving cannot be undone, so it asks once. Staying is the default button.
- **Are you still here?**: Shown when 2 groups are ahead. "I'm here" tells staff this group is still nearby, so staff can tell real customers from people who took a number and left.
- **Called**: When staff tap Call, the whole page turns bright teal and the phone vibrates (Android only; iPhone browsers cannot vibrate). No sound.
- **Removed by staff**: Staff removed the ticket (for example the page had been closed for 20 minutes). Staff can restore it to its old place within 15 minutes, so a customer who was only away briefly is not punished.
- **No-show**: Staff marked No-show 5 minutes after calling.

#### Customer menu

*Customer, phone · Menu module (Zi Chen)* · 5 states

- **Browsing**: Dishes show the photo the merchant uploaded. A dish without a photo (Roti Canai) falls back to its category icon, so the list never shows a broken image. Sold-out dishes stay visible but greyed out.
- **Photos still loading**: On slow data the names, prices and Add buttons appear first; each photo fades in when it arrives. Thumbnails are about 10 KB each, so a 30-dish menu costs around 300 KB.
- **Dish detail**: Tapping a dish opens a larger photo and the full description. The larger image (about 60 KB) only loads here, not in the list.
- **Waiter called**: Right after tapping Call waiter. The button turns into "Waiter called" and stays disabled until a staff member taps Done on the Tables page, so repeated taps do not send more calls.
- **QR expired**: Shown instead of the menu when the table token was replaced after payment.

#### Cart and order status

*Customer, phone · Order module (Clement)* · 7 states

- **Review order**: Quantity is limited to 1 to 20 per dish. Notes stay folded behind a link until the customer adds one. The payment method is chosen here, before the order is sent.
- **Waiting for confirmation**: Every QR order waits here until staff confirm it. Status changes arrive by polling.
- **Confirmed**: Pay now appears because the customer chose card or e-wallet.
- **Changed by staff**: When staff edit a pending order (here because only enough egg was left for one plate), the customer sees exactly what changed and the new total before the kitchen starts.
- **Waiter already called**: Blocked state for Call waiter: while a call is open the button stays disabled on every table page, here the order status page.
- **Rejected by staff**: The reason staff picked when rejecting is shown word for word. Nothing was charged and no stock was deducted.
- **Served**

#### Payment

*Customer, phone · Payment module (Zheng Yang)* · 8 states

- **Bill**: Service charge and SST are separate lines at the owner's rates. Voucher and member phone are optional.
- **Member found**: After the voucher and the member phone are matched, the member name and points balance appear with a Use points field. 100 points = RM1.00 (placeholder rate, set in Settings).
- **Points applied**: Order of discounts: subtotal, voucher, points, then service charge on the discounted subtotal and SST on that plus service charge. Each line is rounded to RM0.01. Points earned on this bill: 29.
- **Not enough points**: Asking for more points than the balance is refused under the field. The bill is unchanged until a valid amount is entered.
- **Voucher expired**: An expired code is refused under the field with its end date. The bill stays as it was and the customer can still pay.
- **Card sandbox**: The gateway's own sandbox page. Shown so the hand-off and return are designed, not to restyle the gateway.
- **Failed**: The error says what happened, that no money was taken, and what to do next. The bill and voucher are kept.
- **Cash at counter**: Shown when the customer chose cash. The page waits (polling) and opens the e-receipt once the cashier records the payment.

#### E-receipt

*Customer, phone · Payment module (Zheng Yang)* · 2 states

- **Paid**: Opens right after payment and later from its link. The table QR token is replaced at this moment, so the old table QR now shows the expired page.
- **Split started**: The payer has paid the full bill and now shares one QR or link with the table. It stays valid for 24 hours.

#### Split bill

*Each diner, own phone · Payment module (Zheng Yang)* · 5 states

- **Join with name**: Opened by the split QR or link. Names must be unique within the split; a taken name shows "Nurul is already in this split. Add an initial, for example Nurul A."
- **Name already taken**: Names must be unique within one split so claims are not mixed up. The error suggests a fix.
- **Claiming (live)**: Every phone shows everyone's ticks within 5 s. A dish with quantity 2 is listed as (1) and (2). A portion ticked by several people is divided equally.
- **Unclaimed blocks completion**: Payer view. Only the payer can add a diner without a phone, remove someone or edit any claim. Complete split stays disabled until every portion has a claimant.
- **My share and receipt**: Shares add up exactly to the bill: 12.32 + 12.32 + 10.81 = 35.45. Any rounding cent goes to the last share (Kavitha).

### Cashier, waiter and kitchen

Cashier role on a phone or counter tablet. The kitchen wall tablet signs in with a staff account and shows only the kitchen view.

#### Staff login

*Staff, any device · Shared* · 3 states

- **Normal**: Same page for Cashier and Owner. The role decides which navigation appears after sign-in.
- **Wrong password**: The message does not say which of the two is wrong. The Staff ID is kept; the password is cleared.
- **Inactive account**: Deactivated staff cannot sign in. Their past transactions stay on record.

#### Home

*Cashier, phone · Shared* · 4 states

- **Busy day**: Things that need a tap come first; the four counts below link to their pages. No charts or trend arrows.
- **Quiet morning**: Zeros are shown as zeros, with one line saying what will appear here.
- **Low-stock warning**: Appears on staff and owner screens when an ingredient falls below the owner's minimum. The count also sits in the app bar on every page.
- **Choose dishes to mark unavailable**: Opened from Mark dishes unavailable. Each dish shows roughly how many more plates the stock allows, so staff switch off only what will run out. Nothing changes until Save.

#### Queue list

*Cashier, phone · Table module (Clement)* · 4 states

- **Several waiting**: Each ticket shows whether its page is still open (from the polling heartbeat) or the customer tapped "I'm here". A ticket whose page has been closed for 20 minutes is flagged amber. Staff can remove any waiting ticket at any time, and can mark No-show right after calling: no forced 5-minute wait.
- **Remove a ticket**: Removing needs a reason (kept on record). "Took two numbers" covers people holding a ticket at more than one place.
- **Removed, can restore**: The removed ticket moves to "Recently removed" for 15 minutes. Restore puts it back in its old place, so a customer who stepped away briefly is not sent to the back.
- **Empty**

#### Table grid

*Cashier, phone or counter tablet · Table module (Clement)* · 4 states

- **Live grid**: Grouped by dining area. Status is carried by a text line as well as colour: time waiting for food, or the amount to pay.
- **Waiter call**: A customer tapped Call waiter on T7. The alert stays pinned until a staff member taps Done.
- **Table detail**: On a phone, tapping a table opens its order in a bottom sheet with the two actions staff need most.
- **Counter tablet**: Same grid at 1024 px with the selected table's order beside it, so the cashier does not leave the page to take payment.

#### Orders

*Cashier, phone · Order module (Clement)* · 8 states

- **Pending to confirm**: Every QR order lands here first. The kitchen sees it only after Confirm, which also deducts ingredients by recipe.
- **New order arrives**: A new QR order shows a banner on every staff page and raises the Orders badge within 5 s (polling). The banner stays until someone opens the order. A chime can be switched on for the counter tablet in Settings; it is off by default.
- **Insufficient stock**: Confirm failed because a recipe needs more than is in stock. Confirm is disabled and Edit becomes the main action.
- **Edit items**: Bottom sheet within thumb reach. Saving sends the customer a new total and keeps the order Pending.
- **Cancel a confirmed order**: FR-OR-04. A confirmed order that has not been served yet can be cancelled with a reason. The kitchen ticket disappears and the customer sees the reason.
- **Order cancelled, stock restored**: Cancelling reverses the recipe deduction made at confirmation. The restored amounts are listed so staff can trust the stock figures.
- **Already served**: Blocked case for FR-OR-04: a served order cannot be cancelled, because the food and its ingredients are gone. Refunds after payment are done by the owner in Transactions.
- **Reject**: Rejecting needs a reason, which the customer sees on their order status page. Stops prank and duplicate orders.

#### Kitchen view

*Kitchen, tablet on the wall · Order module (Clement)* · 4 states

- **Confirmed orders**: Only confirmed orders, oldest first from the left. Read from a metre away: 24 px dish lines, 40 px table numbers, one button per ticket. A ticket turns amber after 10 minutes.
- **Served with undo**: Tapping Served removes the ticket at once and shows Undo for 8 seconds, because a wet hand on a wall tablet will mis-tap. The kitchen never needs a confirmation dialog.
- **Record waste**: For anything the recipe does not cover: dropped or spoiled food, a dish remade, or an extra portion. Big buttons for wet hands. It deducts stock and is logged as waste, separate from sales, so the owner can see where ingredients went.
- **None waiting**: The device signs in with a staff account and stays on this page; there is no navigation to tap by mistake.

#### Payment at the counter

*Cashier, phone · Payment module (Zheng Yang)* · 2 states

- **Cash with change**: The customer quotes the table number at the counter. Change is worked out as the cashier types. Recording the payment replaces the table's QR token and opens the e-receipt.
- **Expired voucher**: An expired or deactivated voucher is refused with its end date. The bill is unchanged.

#### Void approval

*Cashier with the Owner beside · Payment module (Zheng Yang)* · 3 states

- **Supervisor prompt**: The cashier taps Void and gives a reason; the prompt then asks for the Owner's ID and password on the cashier's screen.
- **Approval failed**: Wrong owner credentials. The reason is kept and only the password is cleared.
- **Voided record**: The record shows who, when and why. The amount is struck through, not removed.

#### Members

*Cashier or Owner, phone · Membership module (Zheng Yang)* · 5 states

- **Search results**: Reached from the menu button. Search matches name or any part of the phone number.
- **No match**
- **Member detail**: Tapping a member opens their details and points history. Cashiers can view it; adjusting points, editing and deactivating are done by the owner.
- **Register**: Name and phone are required; the phone must be a unique Malaysian mobile number. Email is optional. Members are found by phone at payment; customers never sign in.
- **Duplicate phone**: The error names the existing member and offers to open that record.

#### Menu and dish photos

*Cashier, phone · Menu module (Zi Chen)* · 5 states

- **Dishes without photos**: Reached from the menu button. Cashiers can search the menu but not change it, except photos: dishes without one show Add photo, and the "No photo" filter lists the gaps.
- **Check the photo**: Add photo opens the phone camera directly. After the shot the cashier checks it against three simple tips before it goes on the menu. Drag to move the dish inside the square.
- **Photo added**: With approval off (the default) the photo goes on the customer menu at once. Undo is offered for 8 seconds; after that the owner can still replace or remove it.
- **Sent for approval**: If the owner turned on approval, the photo waits for them. Customers keep seeing the old photo, or the category icon, until it is approved.
- **Photos turned off**: When the owner switches photo uploads off for cashiers, the buttons disappear instead of failing when tapped. The server also refuses the upload.

### Owner back office

Owner role on a PC (1280 px wide). The owner can also open every front-of-house page.

#### Home (owner)

*Owner, PC · Shared* · 1 states

- **Owner**: Same four counts as the cashier, plus today's takings and the low-stock list. Each block links to its page.

#### Table setup and QR

*Owner, PC · Table module (Clement)* · 4 states

- **List**: Shows 7 of 15 rows. The QR token column tells the owner a fresh code is in use after each payment.
- **Add or edit form**: The same form adds a table (empty) or edits one (filled).
- **Print QR**: Also holds the queue QR for the door. Printing uses the browser, since the system has no printer of its own.
- **Cannot remove**: Removal is blocked with the reason and what to do about it.

#### Menu management

*Owner, PC · Menu module (Zi Chen)* · 8 states

- **Dish list**: Each dish shows its photo. Dishes without one get an Add photo button and a "No photo" filter, so the owner can fill gaps. The availability switch is what staff use when stock runs low.
- **Add dish**: Opened from Add dish. One page in the order owners think: photo, name and price, then recipe. The preview on the left updates as they type. Only name, category and price are required.
- **Uploading photo**: The photo uploads while the owner keeps typing. Cancel stops it without losing the form.
- **Dish with photo**: The photo is shrunk in the browser before upload (4.1 MB to 180 KB), so it is quick on restaurant Wi-Fi and light for customers. The preview shows exactly how the dish will look on the menu.
- **Photo not accepted**: Only a wrong file type is refused. Large photos are never refused; they are shrunk instead. iPhone photos arrive as JPG automatically.
- **Validation errors**: Save shows a short summary at the top and each message under its field. Everything already entered, including the photo, is kept.
- **Photo to approve**: Only when "Staff photos need my approval" is on. The banner shows on the Menu page and on Home until the photo is approved or rejected. Rejecting tells the cashier why.
- **Cannot remove**: Removal is blocked while a dish is in a pending, confirmed or unpaid order.

#### Inventory

*Owner, PC · Inventory module (Zi Chen)* · 8 states

- **Stock list**: Rows under the minimum are red, carry a Low badge and sort to the top. Red is used for nothing else on this page.
- **Stock-in**: Adds to the current level. The result is shown before saving.
- **Stock-take adjust**: Sets the level to a counted figure and records the difference with a reason.
- **Ingredient history**: Every change to stock is a line: stock-in, orders by recipe, waste recorded by the kitchen, and stock-take differences. Waste and unexplained losses are counted separately from sales, so a dropped egg or a heavy-handed recipe shows up instead of silently draining stock.
- **Add ingredient**: FR-IN-01. Name, unit and minimum level. Stock is stored in grams, millilitres or pieces; large amounts are shown as kg or L.
- **Duplicate ingredient**: Names are unique, so recipes and stock never point at two different "Egg" items.
- **Invalid minimum level**: The minimum level must be 0 or more. 0 turns off the low-stock alert for that ingredient.
- **Cannot remove**: Removal is blocked while any recipe uses the ingredient, with the recipes named.

#### Transactions and reports

*Owner, PC · Payment module (Zheng Yang)* · 6 states

- **Daily sales**: Plain tables the owner can read and check against the cash drawer. Voids and refunds are reported separately and never hidden.
- **History**: Every bill stays in the list. A voided bill is greyed with its amount struck through and opens to show who voided it and why.
- **Refund**: FR-PY-03. Owner only. A full or part refund needs a reason and goes back to the original payment method. The bill stays on record.
- **Refund too large**: Invalid case: the amount can never be more than what was paid. Refund stays disabled until the amount is valid.
- **Refunded record**: The refunded bill keeps its original total, shows the refunded amount, who did it and when. Reports count it under Voids and refunds.
- **Empty date range**: A range with no sales says so and offers the nearest useful action, not a page of zero tables.

#### Vouchers

*Owner, PC · Membership module (Zheng Yang)* · 4 states

- **List**: Vouchers are never deleted: active ones can be deactivated and reactivated, and expired ones stay listed so past bills still make sense.
- **Create voucher**: FR-MB-01. Code, % or RM discount, value, minimum bill, dates and members only. The same form opens with values filled in for Edit.
- **Duplicate code**: Codes must be unique, including deactivated and expired ones, so old receipts stay unambiguous.
- **End date before start**: Invalid dates are refused under the End date field.

#### Members and points

*Owner, PC · Membership module (Zheng Yang)* · 6 states

- **Member detail**: Opened from the Members list. Owner view of the same record cashiers see, with Edit, Deactivate and Adjust points.
- **Edit member**: FR-MB-03. Same fields as registration; the phone must stay unique.
- **Deactivate member**: FR-MB-04. Members are never deleted. Deactivating stops earning and redeeming until reactivated.
- **Deactivated member**: The record and its points stay. Adjust points is disabled while inactive; Reactivate brings everything back.
- **Adjust points**: Owner only. Every adjustment needs a reason and shows the balance before and after. It appears in the points history with the owner's name.
- **Adjust points below zero**: Invalid case: points never go below 0, so removing more than the balance is refused.

#### Staff accounts and settings

*Owner, PC · Shared* · 9 states

- **Account list**: Accounts are deactivated, not deleted, so past transactions keep their staff name. The kitchen tablet uses its own Cashier-role account.
- **Add account**: FR-SH-03. Name, Staff ID, password and role. Edit opens the same form; leaving the password empty keeps the current one.
- **Staff ID taken**: Staff IDs are unique across active and inactive accounts.
- **Password too short**: Passwords need at least 8 characters.
- **Rates**: Both rates default to 0%. The example line shows the owner the effect before saving.
- **Cashier permissions**: Lets the owner hand photo taking to staff without giving away prices or recipes. Defaults: photos on, approval off, so a cashier can fill gaps during a quiet hour.
- **Points**: The earn rate is fixed by the report (1 point per RM1, rounded down) and shown read-only. The redemption value is a placeholder until the team fixes it.
- **Walk-in queue rules**: The party limit follows the largest table by default instead of a fixed number. The hold time no longer blocks the queue, and closed ticket pages are flagged so staff can remove people who left.
- **Rate out of range**: Rates outside 0 to 20% are refused under the field. The other field keeps its value.

## 5. Business rules decided during design

These change or add to the brief. They need team agreement and backend support.

1. **Queue removal.** Staff can remove a waiting ticket at any time, with a reason (left, took two numbers, asked to cancel, other). A removed ticket can be restored to its old place within 15 minutes. No-show can be marked right after calling; the 5-minute hold only keeps the table and no longer blocks calling the next group.
2. **Queue presence.** The ticket page already polls every 5 seconds, so the server records when each ticket was last seen. Tickets whose page has been closed for 20 minutes (owner setting) are flagged on the staff Queue page. When two groups are ahead, the customer is asked "Are you still here?".
3. **No sound on the queue page.** When called, the whole page turns bright teal and Android phones vibrate. iPhone browsers cannot vibrate, so staff should also call the number aloud.
4. **Party size limit.** It follows the largest table in Table setup (now 8 seats) instead of a fixed number. The owner can set their own limit.
5. **Waste and extra use.** The kitchen records waste (dropped, spoiled, burnt, dish remade, extra in a dish, optionally linked to an order). Each ingredient has a full stock history: recipe deductions, waste, stock-in and stock-take differences. Repeated extra use on one dish suggests fixing that recipe.
6. **Dish photos.** Photos are optional. They are shrunk in the browser before upload: about 10 KB thumbnails for the list and about 60 KB for the dish detail, stored in Supabase Storage. Text loads first and photos fill in.
7. **Staff photo permission.** Cashiers can add or replace dish photos from their phone, but cannot change names, prices or recipes. The owner can switch this off or require approval before photos go live. The backend should expose photo upload as its own endpoint.
8. **Membership points.** Members earn 1 point per RM1 paid, rounded down, added after payment. Points are redeemed at payment at **100 points = RM1.00. This value is a placeholder until the team fixes it, and the owner can change it in Settings.** The order of discounts is: subtotal → voucher → points → service charge on the discounted subtotal → SST on (discounted subtotal + service charge), each line rounded to RM0.01. Example: RM35.40 − RM5.00 voucher − 500 points (RM5.00) = RM25.40; service RM2.54; SST RM1.68; total RM29.62, which earns 29 points. Points never go below 0. Owner adjustments need a reason and appear in the member's points history.
9. **Members.** Members have a name and phone (both required; the phone is a unique Malaysian mobile number) and an optional email. Members and vouchers are never deleted, only deactivated and reactivated.
10. **Best sellers.** Ranked by quantity sold. The top 5 over the last 30 days get the Best seller label on the menu.
11. **Cancel and refund.** A confirmed order that has not been served can be cancelled with a reason, and its stock is restored. A served order cannot be cancelled. After payment, the owner can refund all or part of a bill (never more than was paid), with a reason, back to the original payment method.
12. **Customer queue page.** Shows the number of groups ahead, never an estimated waiting time. Call waiter stays disabled until staff tap Done.
13. **Visual rules.** The brief asked for one brand colour and a system font. The approved style uses iOS blue with decorative icon colours, and SF or Inter.

## 6. Acceptance testing

**Method.** Automated checks ran in a real browser (Playwright and Chromium) over all 124 states after every change:

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

**Text length (v3.3).** All on-screen text was listed by length. The 88 texts of 9 words or more were cut to 13, and those 13 are data lines (dates, receipt numbers, stock figures) or 9-word lines.

**Arithmetic.** Every bill, split and receipt that changed was recalculated: points bill RM29.62, cashier bill with points RM21.57 (change RM28.43 from RM50), points earned and balances (1,205 + 35 = 1,240) and member history balances. The daily sales report was checked: the seven days add up to RM9,412.80, which matches Revenue and the payment-method total (302 bills both ways).

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
- The points redemption value (100 points = RM1.00) is a placeholder.

## 7. Next steps

1. **Agree the rules.** The team agrees the rules in section 5 and updates the brief.
2. **Design the data and APIs.** Design the database tables (Supabase PostgreSQL) and the API list (Python FastAPI) from these screens.
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
