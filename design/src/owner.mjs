import { food } from './food.mjs';
import { tile, i, btn, iconBtn, badge, field, check, toggle, kv, alert, emp, qr, tbl, mod, tabs, pc, section } from './lib.mjs';

const acts = (name, extra = '') => `<div class="d-flex gap-2 justify-content-end">${extra}${iconBtn('pencil', 'Edit ' + name)}${iconBtn('trash', 'Remove ' + name)}</div>`;
const searchBox = (ph, w = 280) => `<div style="width:${w}px">${field(null, ph, { ph: 1, pre: i('search'), aria: ph })}</div>`;
const sel = (v, w = 180) => `<div style="width:${w}px">${field(null, v, { sel: 1, aria: v })}</div>`;
const R = { c: 'text-end' };
const blocked = (title, why, text, w = 460) => mod(title, alert('danger', why, text), btn('Close', 'primary'), w);

/* ---------- Home (owner) ---------- */
const home = [
  pc('Home · Owner', 'Home', 'Home', { sub: 'Tue 17 Nov 2026', low: 2, note: 'Same four counts as the cashier, plus today\'s takings and the low-stock list. Each block links to its page.' }, `
    <div class="alert alert-danger d-flex align-items-center gap-3 mb-0" role="alert">${i('exclamation-triangle-fill')}<div class="flex-grow-1"><span class="fw-semibold">2 ingredients are below their minimum:</span> Egg (12 pcs, minimum 30) and Santan (1.5 L, minimum 3 L).</div>${btn('Open inventory', 'danger', { sm: 1 })}</div>
    <div class="d-flex gap-3">${stat('Orders today', '47', '3 pending · 5 in the kitchen')}${stat('Open tables', '9 of 15', '4 awaiting payment')}${stat('Queue', '5', 'Longest wait 18 min')}${stat('Sales today', 'RM1,284.60', '39 paid bills · 1 void')}</div>
    <div class="d-flex gap-3 align-items-start">
      <div class="flex-fill"><h2 class="fs-6 mb-2">Needs attention</h2>${tbl(['What', 'Where', { h: '', ...R }], [
        ['3 orders waiting to confirm', 'Orders', btn('Review', 'outline-primary', { sm: 1 })],
        ['T7 is calling a waiter', 'Tables', btn('Open', 'outline-primary', { sm: 1 })],
        ['A019 called 2 min ago', 'Queue', btn('Open', 'outline-primary', { sm: 1 })]])}</div>
      <div class="flex-fill"><h2 class="fs-6 mb-2">Revenue by payment method, today</h2>${tbl(['Method', { h: 'Bills', ...R }, { h: 'Revenue', ...R }], [
        ['Card', '14', 'RM512.30'], ['E-wallet', '11', 'RM398.80'], ['Cash', '14', 'RM373.50'], ['<b>Total</b>', '<b>39</b>', '<b>RM1,284.60</b>']])}</div>
    </div>`),
];

/* ---------- Table setup and QR ---------- */
const trow = (no, areaName, seats, status, tone) => [`<b>${no}</b>`, areaName, seats, badge(status, tone), `<span class="text-body-secondary">${no === 'T3' ? 'Replaced 7:58 pm' : 'Replaced today'}</span>`, acts(no, btn('QR', 'outline-secondary', { sm: 1, i: 'qr-code' }))];
const tableRows = [trow('T1', 'Indoor', 4, 'Awaiting payment', 'brand'), trow('T2', 'Indoor', 2, 'Free', 'outline'), trow('T3', 'Indoor', 4, 'Waiting for food', 'wait'), trow('T4', 'Indoor', 6, 'Free', 'outline'), trow('T7', 'Outdoor', 4, 'Waiting for food', 'wait'), trow('T8', 'Outdoor', 2, 'Free', 'outline'), trow('T13', 'Upstairs', 8, 'Free', 'outline')];
const tablePage = `<div class="qs-toolbar">${sel('All areas')}${searchBox('Search table number')}<div class="ms-auto small text-body-secondary">15 tables in 3 areas. Largest table: T13, 8 seats, which sets the queue party limit.</div></div>${tbl(['Table', 'Area', 'Seats', 'Status', 'QR token', { h: '', ...R }], tableRows)}`;
const tact = btn('Print QR codes', 'outline-secondary', { i: 'printer' }) + btn('Add table', 'primary', { i: 'plus-lg' });
const tset = (name, o) => pc(`Tables & QR · ${name}`, 'Tables & QR', 'Tables & QR', { act: tact, ...o }, tablePage);
const tablesQr = [
  tset('List', { note: 'Shows 7 of 15 rows. The QR token column tells the owner a fresh code is in use after each payment.' }),
  tset('Add or edit form', { modal: mod('Edit table T4', `<div class="d-flex gap-3">${field('Table number', 'T4', { c: 'flex-fill' })}${field('Seats', '6', { type: 'number', c: 'flex-fill' })}</div>${field('Dining area', 'Indoor', { sel: 1 })}`, btn('Cancel', 'outline-secondary') + btn('Save table', 'primary'), 440), note: 'The same form adds a table (empty) or edits one (filled).' }),
  tset('Print QR', { modal: mod('Print QR codes', `<div class="small text-body-secondary">Opens the browser print dialog with one card per table. No special printer is needed.</div><div class="qs-sheetprint">${['T1', 'T2', 'T3'].map((n, j) => `<div>${qr(120, 40 + j)}<div class="fs-4 fw-bold">${n}</div><div class="small">Scan to order and pay</div></div>`).join('')}</div>${field('Tables to print', 'All 15 tables', { sel: 1 })}`, btn('Cancel', 'outline-secondary') + btn('Print', 'primary', { i: 'printer' }), 560), note: 'Also holds the queue QR for the door. Printing uses the browser, since the system has no printer of its own.' }),
  tset('Cannot remove', { modal: blocked('T3 cannot be removed', 'T3 has an unpaid order', 'Order #1042 (RM41.28) is still open on this table. Take payment or reject the order, then remove the table.'), note: 'Removal is blocked with the reason and what to do about it.' }),
];

/* ---------- Menu management ---------- */
const thumb = (img, name) => img ? `<span class="qs-ph sm">${food(img, 44)}</span>` : `<button type="button" class="qs-ph-add" aria-label="Add a photo of ${name}">${i('camera')}<span>Add photo</span></button>`;
const mrow = (name, catName, price, recipe, on, o = {}) => ({ c: [thumb(o.img, name), `<b>${name}</b>${o.best ? ' ' + badge('Best seller', 'brand') : ''}`, catName, price, `<span class="text-body-secondary">${recipe}</span>`, `<div class="d-flex align-items-center gap-2">${toggle('Available: ' + name, on)}<span>${on ? 'Available' : 'Unavailable'}</span></div>`, acts(name)] });
const menuRows = [
  mrow('Nasi Lemak Ayam', 'Rice', 'RM9.50', '5 ingredients', true, { best: 1, img: 'nasi-lemak' }), mrow('Nasi Goreng Kampung', 'Rice', 'RM8.50', '6 ingredients', false, { img: 'nasi-goreng' }),
  mrow('Mee Goreng Mamak', 'Noodles', 'RM8.00', '7 ingredients', true, { best: 1, img: 'mee-goreng' }), mrow('Roti Canai (2 pcs)', 'Roti', 'RM3.00', '3 ingredients', true),
  mrow('Teh Tarik', 'Drinks', 'RM2.80', '3 ingredients', true, { best: 1, img: 'teh-tarik' }), mrow('Milo Ais', 'Drinks', 'RM3.50', '3 ingredients', true, { img: 'milo-ais' }), mrow('Cendol', 'Desserts', 'RM4.50', 'No recipe yet', true)];
const menuPage = `<div class="qs-toolbar">${sel('All categories')}${searchBox('Search dishes')}<button type="button" class="qs-chip">${i('camera')} No photo <span class="badge qs-b-neutral">2</span></button>${btn('Manage categories', 'link')}<div class="ms-auto small text-body-secondary">32 dishes, 1 unavailable</div></div>${tbl([{ h: 'Photo' }, 'Dish', 'Category', { h: 'Price', ...R }, 'Recipe', 'Availability', { h: '', ...R }], menuRows)}`;
const mset = (name, o) => pc(`Menu · ${name}`, 'Menu', 'Menu', { act: btn('Add dish', 'primary', { i: 'plus-lg' }), ...o }, menuPage);

// Add dish is a full page: photo and live preview on the left, details and recipe on the right.
const rline = (ing, qty, unit, err) => `<div class="d-flex gap-2 align-items-start"><div class="flex-grow-1">${field(null, ing, { sel: 1, aria: 'Ingredient' })}</div><div style="width:150px">${field(null, qty, { suf: unit, aria: 'Quantity of ' + ing, err })}</div>${iconBtn('trash', 'Remove ' + ing)}</div>`;
const drop = (err) => `<div class="qs-drop${err ? ' err' : ''}">${tile('camera', err ? 'red' : 'c-blue', 'lg')}<div class="fw-bold">Add a photo</div><div class="small text-body-secondary">Drag a photo here or choose one from this computer. On a tablet or phone you can take one with the camera.</div><div class="d-flex gap-2">${btn('Choose photo', 'outline-secondary', { i: 'image' })}${btn('Take photo', 'outline-secondary', { i: 'camera' })}</div><div class="small text-body-secondary">JPG, PNG or WebP. Big photos are shrunk for you. Square photos look best.</div></div>
  ${err ? alert('danger', 'menu-price-list.pdf is not a photo', 'Choose a JPG, PNG or WebP image of the dish.') : ''}`;
const photoCard = (state) => {
  let inner;
  if (state === 'empty' || state === 'error') inner = drop(state === 'error');
  else if (state === 'uploading') inner = `<div class="qs-photo up">${food('nasi-goreng', 328)}</div><div><div class="d-flex justify-content-between small fw-semibold"><span>Uploading nasi-goreng-ayam.jpg</span><span>1.2 of 2.0 MB</span></div><div class="qs-prog mt-2" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress"><i style="width:60%"></i></div></div>${btn('Cancel upload', 'outline-secondary', { block: 1 })}`;
  else inner = `<div class="qs-photo">${food('nasi-goreng', 328)}</div><div class="d-flex gap-2">${btn('Replace photo', 'outline-secondary', { c: 'flex-fill', i: 'arrow-repeat' })}${btn('Remove', 'outline-secondary', { c: 'flex-fill', i: 'trash' })}</div><div class="small text-body-secondary">Shrunk from 4.1 MB to 180 KB. Customers see a 10 KB thumbnail in the list and this version when they open the dish.</div>`;
  return `<div class="card"><div class="card-body d-flex flex-column gap-3"><div><h2 class="fs-6">Photo <span class="fw-normal text-body-secondary">(optional)</span></h2></div>${inner}</div></div>`;
};
const preview = (withPhoto, name = 'Nasi Goreng Ayam', price = 'RM9.00') => `<div class="card"><div class="card-body d-flex flex-column gap-2"><h2 class="fs-6">How customers will see it</h2>
  <div class="qs-dishes" style="box-shadow:none;border:1px solid var(--line)"><div class="qs-dish">${withPhoto ? `<span class="qs-ph">${food('nasi-goreng', 72)}</span>` : tile('egg-fried', 'tea')}<div class="flex-grow-1 min-w-0"><div class="nm">${name || '<span class="text-body-secondary">Dish name</span>'}</div><div class="ds">Fried rice with chicken and egg</div><div class="mt justify-content-between"><span class="pr">${price}</span><span class="qs-add" aria-hidden="true">${i('plus-lg')}</span></div></div></div></div>
  ${withPhoto ? '' : '<div class="small text-body-secondary">Without a photo the dish shows its category icon.</div>'}</div></div>`;
const details = (st) => {
  const bad = st === 'invalid', empty = st === 'empty';
  return `<div class="card"><div class="card-body d-flex flex-column gap-3"><h2 class="fs-6">Details</h2>
  <div class="d-flex gap-3 align-items-start">${field('Dish name', empty || bad ? 'For example Nasi Goreng Ayam' : 'Nasi Goreng Ayam', { c: 'flex-fill', ph: empty || bad, err: bad ? 'Enter a dish name.' : '' })}${field('Category', 'Rice', { sel: 1, c: 'flex-fill' })}</div>
  <div class="d-flex gap-3 align-items-start"><div style="width:200px">${field('Price', bad ? '0.00' : empty ? '0.00' : '9.00', { pre: 'RM', ph: empty, err: bad ? 'Enter a price above RM0.00.' : '' })}</div><div class="flex-fill">${field('Description (shown to customers)', empty ? 'What is in it, in one line' : 'Fried rice with chicken and egg', { ph: empty })}</div></div>
  <div class="d-flex flex-wrap gap-4">${check('Spicy (shows a fire icon)', false)}${check('Available as soon as it is saved', true)}</div>
  <div class="small text-body-secondary">Best seller labels are added automatically to the 5 dishes that sold most in the last 30 days.</div></div></div>`;
};
const recipe = (st) => {
  const bad = st === 'invalid', empty = st === 'empty';
  return `<div class="card"><div class="card-body d-flex flex-column gap-3"><div><h2 class="fs-6">Recipe for one serving</h2><div class="small text-body-secondary">Confirming an order deducts these amounts times the quantity. Cancelling restores them. Extra used in the kitchen is recorded as waste.</div></div>
  ${empty ? `<div class="qs-note">${i('info-circle')}<span>No ingredients yet. Without a recipe this dish will not change stock.</span></div>` : `${rline('Rice', '200', 'g')}${rline('Chicken', '80', 'g')}${rline('Egg', bad ? '0' : '1', 'pcs', bad ? 'Enter more than 0.' : '')}`}
  <div>${btn('Add ingredient', 'outline-primary', { i: 'plus-lg', sm: 1 })}</div></div></div>`;
};
const addPage = (name, st, photo, note) => pc(`Menu · ${name}`, 'Menu', 'Add dish', { upd: false, sub: 'Menu › New dish', note, act: btn('Cancel', 'outline-secondary') + btn('Save dish', 'primary', { i: 'check-lg' }) }, `
  ${st === 'invalid' ? alert('danger', '2 things to fix before saving', 'Dish name is empty, and the egg quantity is 0.') : ''}
  <div class="qs-dishform"><div class="d-flex flex-column gap-3">${photoCard(photo)}${preview(photo === 'done' || photo === 'uploading', st === 'empty' || st === 'invalid' ? '' : 'Nasi Goreng Ayam', st === 'empty' ? 'RM0.00' : 'RM9.00')}</div>
  <div class="d-flex flex-column gap-3">${details(st)}${recipe(st)}</div></div>`);
const menu = [
  mset('Dish list', { note: 'Each dish shows its photo. Dishes without one get an Add photo button and a "No photo" filter, so the owner can fill gaps. The availability switch is what staff use when stock runs low.' }),
  addPage('Add dish', 'empty', 'empty', 'Opened from Add dish. One page in the order owners think: photo, name and price, then recipe. The preview on the left updates as they type. Only name, category and price are required.'),
  addPage('Uploading photo', 'filled', 'uploading', 'The photo uploads while the owner keeps typing. Cancel stops it without losing the form.'),
  addPage('Dish with photo', 'filled', 'done', 'The photo is shrunk in the browser before upload (4.1 MB to 180 KB), so it is quick on restaurant Wi-Fi and light for customers. The preview shows exactly how the dish will look on the menu.'),
  addPage('Photo not accepted', 'filled', 'error', 'Only a wrong file type is refused. Large photos are never refused; they are shrunk instead. iPhone photos arrive as JPG automatically.'),
  addPage('Validation errors', 'invalid', 'done', 'Save shows a short summary at the top and each message under its field. Everything already entered, including the photo, is kept.'),
  mset('Cannot remove', { modal: blocked('Mee Goreng Mamak cannot be removed', 'This dish is in an active order', 'Order #1042 on T3 includes it. Mark the dish unavailable now and remove it after the order is paid.'), note: 'Removal is blocked while a dish is in a pending, confirmed or unpaid order.' }),
];

/* ---------- Inventory ---------- */
const irow = (name, stock, min, used, pct, low) => ({ cls: low ? 'table-danger' : '', c: [`<b>${name}</b>`,
  `<div class="qs-meter${low ? ' low' : ''}"><span class="trk" role="img" aria-label="${stock} in stock, minimum ${min}"><i style="width:${pct}%"></i><em></em></span><span><b>${stock}</b> <span class="text-body-secondary">min ${min}</span></span>${low ? badge('Low', 'danger-solid') : ''}</div>`,
  `<span class="${low ? '' : 'text-body-secondary'}">${used}</span>`, `<div class="d-flex gap-2 justify-content-end">${btn('Stock in', 'outline-primary', { sm: 1 })}${btn('Adjust', 'outline-secondary', { sm: 1 })}${iconBtn('clock-history', 'History of ' + name)}${iconBtn('trash', 'Remove ' + name)}</div>`] });
const invRows = [
  irow('Egg', '12 pcs', '30 pcs', '4 dishes', 20, true), irow('Santan (coconut milk)', '1.5 L', '3 L', '2 dishes', 25, true),
  irow('Rice', '18.4 kg', '10 kg', '5 dishes', 92), irow('Chicken', '6.2 kg', '4 kg', '6 dishes', 78), irow('Yellow noodles', '4.5 kg', '3 kg', '2 dishes', 75),
  irow('Condensed milk', '9 cans', '6 cans', '3 dishes', 75), irow('Tea dust', '2.1 kg', '1 kg', '2 dishes', 100), irow('Pandan leaves', '14 bunches', '5 bunches', 'Not in any recipe', 100)];
const invPage = `<div class="d-flex gap-3">${stat('Ingredients', '24', 'Tracked by recipe')}${stat('Below minimum', '2', 'Egg and Santan')}${stat('Last stock-in', 'Today, 10:15 am', 'Rice 25 kg from Pasar Borong')}</div>${tabs(['All ingredients <span class="badge qs-b-neutral ms-2">24</span>', 'Low stock <span class="badge qs-b-danger-solid ms-2">2</span>'])}<div class="qs-toolbar">${searchBox('Search ingredients')}<div class="ms-auto small text-body-secondary">Stock drops automatically when an order is confirmed</div></div>${tbl(['Ingredient', 'Stock level', 'Used in', { h: '', ...R }], invRows)}`;
const iset = (name, o) => pc(`Inventory · ${name}`, 'Inventory', 'Inventory', { low: 2, act: btn('Record waste', 'outline-secondary', { i: 'clipboard-minus' }) + btn('Add ingredient', 'primary', { i: 'plus-lg' }), ...o }, invPage);
const L = (time, what, by, chg, after, cls = '') => ({ cls, c: [time, what, by, `<span class="${chg ? 'fw-bold' : ''}">${chg}</span>`, after] });
const eggHistory = mod('Egg · stock history, today', `
  <div class="d-flex gap-3">${stat('Used by recipes', '90 pcs', '43 confirmed orders')}${stat('Recorded waste', '4 pcs', 'Dropped 3, extra in a dish 1')}${stat('Not explained', '2 pcs', 'Found at the 7:30 pm count')}</div>
  <div class="qs-ledger">${tbl(['Time', 'What happened', 'By', { h: 'Change', c: 'text-end' }, { h: 'Stock after', c: 'text-end' }], [
    L('9:00 am', 'Opening stock', 'Mei Ling', '', '18'),
    L('10:15 am', 'Stock in: Pasar Borong, 3 trays', 'Mei Ling', '+90', '108'),
    L('11:02 am to 7:20 pm', '42 confirmed orders, by recipe', 'System', '−88', '20'),
    L('6:52 pm', 'Waste: dropped', 'Kitchen tablet', '−3', '17', 'table-warning'),
    L('7:10 pm', 'Waste: extra in a dish. Order #1039, Nasi Goreng Kampung used 2 eggs (recipe says 1)', 'Kitchen tablet', '−1', '16', 'table-warning'),
    L('7:23 pm', 'Order #1042, 2 × Nasi Lemak Ayam, by recipe', 'System', '−2', '14'),
    L('7:30 pm', 'Stock-take: counted 12, expected 14', 'Aina', '−2', '12')])}</div>
  ${alert('warning', 'Nasi Goreng Kampung often uses more egg than its recipe', 'Extra egg was recorded for it 4 times this week. If 2 eggs is normal, update the recipe so stock is deducted correctly.', 'lightbulb')}`, btn('Close', 'outline-secondary') + btn('Edit Nasi Goreng Kampung recipe', 'primary'), 900);
const inventory = [
  iset('Stock list', { note: 'Rows under the minimum are red, carry a Low badge and sort to the top. Red is used for nothing else on this page.' }),
  iset('Stock-in', { modal: mod('Stock in · Egg', `<div class="small text-body-secondary">In stock now: 12 pcs · minimum 30 pcs</div>${field('Quantity received', '90', { suf: 'pcs' })}${field('Supplier or note (optional)', 'Pasar Borong, 3 trays')}<div class="alert alert-primary mb-0">${kv('New stock level', '102 pcs', 'fw-semibold')}</div>`, btn('Cancel', 'outline-secondary') + btn('Add to stock', 'primary'), 440), note: 'Adds to the current level. The result is shown before saving.' }),
  iset('Stock-take adjust', { modal: mod('Stock-take · Santan (coconut milk)', `<div class="small text-body-secondary">The system expects 1.5 L. Enter what you counted.</div>${field('Counted quantity', '1.0', { suf: 'L' })}${field('Reason', 'Spoiled', { sel: 1 })}<div class="alert alert-secondary mb-0">${kv('Adjustment', '−0.5 L', 'fw-semibold')}<div class="small">Recorded with your name and the time.</div></div>`, btn('Cancel', 'outline-secondary') + btn('Save count', 'primary'), 440), note: 'Sets the level to a counted figure and records the difference with a reason.' }),
  iset('Ingredient history', { modal: eggHistory, note: 'Every change to stock is a line: stock-in, orders by recipe, waste recorded by the kitchen, and stock-take differences. Waste and unexplained losses are counted separately from sales, so a dropped egg or a heavy-handed recipe shows up instead of silently draining stock.' }),
  iset('Cannot remove', { modal: blocked('Rice cannot be removed', 'Used in recipe: Nasi Goreng Kampung', 'Also used in Nasi Lemak Ayam and 3 other dishes. Remove it from those recipes first.'), note: 'Removal is blocked while any recipe uses the ingredient, with the recipes named.' }),
];

/* ---------- Transactions and reports ---------- */
const range = (v) => `<div class="qs-toolbar">${sel(v, 260)}${sel('All payment methods', 220)}<div class="ms-auto">${btn('Export CSV', 'outline-secondary', { sm: 1 })}</div></div>`;
const bar = (pct, label) => `<div class="qs-barcell"><i style="width:${pct * 1.6}px"></i>${label}</div>`;
const reports = [
  pc('Reports · Daily sales', 'Reports', 'Reports', { upd: false, sub: '11 to 17 Nov 2026', note: 'Plain tables the owner can read and check against the cash drawer. Voids and refunds are reported separately and never hidden.' }, `
    ${range('Last 7 days · 11 to 17 Nov 2026')}
    <div class="d-flex gap-3">${stat('Revenue', 'RM9,412.80', '302 paid bills')}${stat('Average bill', 'RM31.17', 'After vouchers, with service charge and SST')}${stat('Voids and refunds', 'RM118.40', '3 voids · 0 refunds')}</div>
    <div class="d-flex gap-3 align-items-start">
      <div class="flex-fill"><h2 class="fs-6 mb-2">Daily sales</h2>${tbl(['Date', { h: 'Bills', ...R }, 'Revenue'], [
        ['Wed 11 Nov', 38, bar(52, 'RM1,146.20')], ['Thu 12 Nov', 35, bar(48, 'RM1,058.90')], ['Fri 13 Nov', 49, bar(70, 'RM1,540.10')], ['Sat 14 Nov', 58, bar(86, 'RM1,893.40')],
        ['Sun 15 Nov', 52, bar(77, 'RM1,702.50')], ['Mon 16 Nov', 31, bar(36, 'RM787.10')], ['Tue 17 Nov', 39, bar(58, 'RM1,284.60')]])}</div>
      <div class="flex-fill d-flex flex-column gap-3">
        <div><h2 class="fs-6 mb-2">Revenue by payment method</h2>${tbl(['Method', { h: 'Bills', ...R }, { h: 'Revenue', ...R }, { h: 'Share', ...R }], [['Card', 112, 'RM3,812.20', '40.5%'], ['E-wallet', 96, 'RM2,970.40', '31.6%'], ['Cash', 94, 'RM2,630.20', '27.9%']])}</div>
        <div><h2 class="fs-6 mb-2">Best sellers</h2>${tbl(['Dish', { h: 'Sold', ...R }, { h: 'Revenue', ...R }], [['Nasi Lemak Ayam', 214, 'RM2,033.00'], ['Teh Tarik', 286, 'RM800.80'], ['Mee Goreng Mamak', 97, 'RM776.00'], ['Roti Canai (2 pcs)', 143, 'RM429.00']])}</div>
      </div>
    </div>`),
  pc('Transactions · History', 'Transactions', 'Transactions', { sub: 'Tue 17 Nov 2026', note: 'Every bill stays in the list. A voided bill is greyed with its amount struck through and opens to show who voided it and why.' }, `
    ${range('Today · 17 Nov 2026')}
    ${tbl(['Receipt', 'Time', 'Table', 'Method', 'Staff', 'Status', { h: 'Total', ...R }], [
      ['R-20261117-0042', '7:58 pm', 'T3', 'Card', 'Self-paid', badge('Paid', 'brand') + ' ' + badge('Split 3', 'outline'), 'RM35.45'],
      ['R-20261117-0041', '7:51 pm', 'T12', 'E-wallet', 'Self-paid', badge('Paid', 'brand'), 'RM14.30'],
      ['R-20261117-0040', '7:40 pm', 'T1', 'Cash', 'Kumar', badge('Paid', 'brand'), 'RM28.60'],
      ['R-20261117-0039', '7:15 pm', 'T10', 'Cash', 'Aina', badge('Paid', 'brand'), 'RM19.80'],
      { cls: 'qs-void', c: ['R-20261117-0038', '7:02 pm', 'T6', 'Cash', 'Aina', badge('Voided', 'neutral') + ' <span class="small">by Mei Ling, 8:12 pm</span>', '<span class="amt">RM51.89</span>'] },
      ['R-20261117-0037', '6:48 pm', 'T5', 'Card', 'Self-paid', badge('Paid', 'brand'), 'RM22.40']])}
    <div class="small text-body-secondary">Showing 6 of 40 transactions today</div>`),
  pc('Reports · Empty date range', 'Reports', 'Reports', { upd: false, sub: '1 to 7 Jun 2026', note: 'A range with no sales says so and offers the nearest useful action, not a page of zero tables.' }, `
    ${range('Custom · 1 to 7 Jun 2026')}
    <div class="card">${emp('graph-up', 'No sales between 1 and 7 Jun 2026', 'QuickServe has recorded sales since 1 Sep 2026. Choose a later range.')}<div class="text-center pb-4">${btn('Show last 7 days', 'outline-primary')}</div></div>`),
];

/* ---------- Vouchers ---------- */
const vrow = (code, off, min, valid, used, status, tone, cls) => ({ cls, c: [`<b>${code}</b>`, off, min, valid, used, badge(status, tone), acts(code)] });
const vouchers = [
  pc('Vouchers · List', 'Vouchers', 'Vouchers', { act: btn('Create voucher', 'primary', { i: 'plus-lg' }), note: 'Expired and deactivated vouchers stay listed so past bills still make sense. At the counter an expired code is refused with its end date.' }, `
    ${tabs(['Vouchers', 'Members <span class="badge qs-b-neutral ms-2">186</span>'])}
    ${tbl(['Code', 'Discount', 'Minimum bill', 'Valid', { h: 'Used', ...R }, 'Status', { h: '', ...R }], [
      vrow('RAYA5', 'RM5.00 off', 'RM20.00', '1 Nov to 31 Dec 2026', '64', 'Active', 'brand'),
      vrow('MEMBER10', '10% off, members only', 'None', 'No end date', '212', 'Active', 'brand'),
      vrow('MERDEKA10', '10% off', 'RM30.00', '1 to 31 Aug 2026', '148', 'Expired', 'neutral', 'qs-void'),
      vrow('OPENING', 'RM3.00 off', 'None', '1 to 30 Sep 2026', '97', 'Deactivated', 'neutral', 'qs-void')])}`),
];

/* ---------- Staff accounts and settings ---------- */
const srow = (name, sid, role, status, last, cls) => ({ cls, c: [`<b>${name}</b>`, sid, role, badge(status, status === 'Active' ? 'brand' : 'neutral'), last, `<div class="d-flex gap-2 justify-content-end">${btn('Reset password', 'outline-secondary', { sm: 1 })}${btn(status === 'Active' ? 'Deactivate' : 'Reactivate', 'outline-secondary', { sm: 1 })}</div>`] });
const rates = (bad) => `<div class="card" style="max-width:640px"><div class="card-body d-flex flex-column gap-3">
  <div><h2 class="fs-5">Service charge and SST</h2><div class="small text-body-secondary">Added as separate lines on every bill and on each split share. Changes apply to new orders only.</div></div>
  <div class="d-flex gap-3 align-items-start"><div class="flex-fill">${field('Service charge', bad ? '25' : '10', { suf: '%', type: 'number', err: bad ? 'Enter a rate from 0 to 20%.' : '', help: bad ? '' : '0 to 20%. Enter 0 to switch it off.' })}</div><div class="flex-fill">${field('SST', '6', { suf: '%', type: 'number', help: '0 to 20%. Enter 0 to switch it off.' })}</div></div>
  <div class="alert alert-secondary mb-0 small">Example on a RM35.40 bill: service charge ${bad ? 'not calculated' : 'RM3.54'}, SST ${bad ? 'not calculated' : 'RM2.34'}, total ${bad ? 'not calculated' : 'RM41.28'}.</div>
  <div class="d-flex gap-2">${btn('Save rates', 'primary')}${btn('Discard changes', 'outline-secondary')}</div></div></div>`;
const queueRules = `<div class="card" style="max-width:640px"><div class="card-body d-flex flex-column gap-3">
  <div><h2 class="fs-5">Walk-in queue</h2><div class="small text-body-secondary">Rules for the queue QR at the door. Changes apply to new tickets.</div></div>
  <fieldset class="d-flex flex-column gap-2"><legend class="form-label">Largest party that can join</legend>
    <label class="qs-opt on">${tile('grid-3x3-gap')}<span class="flex-grow-1"><span class="d-block fw-semibold">Match my largest table: 8 people</span><span class="d-block small text-body-secondary">Updates by itself when you add or edit tables (now T13, 8 seats).</span></span><input class="form-check-input mt-0" type="radio" name="maxp" checked></label>
    <label class="qs-opt">${tile('people')}<span class="flex-grow-1"><span class="d-block fw-semibold">Set my own limit</span><span class="d-block small text-body-secondary">For example 12 if staff can join two tables.</span></span><input class="form-check-input mt-0" type="radio" name="maxp"></label></fieldset>
  <div class="d-flex gap-3 align-items-start"><div class="flex-fill">${field('Hold the table after calling', '5', { suf: 'min', type: 'number', help: 'Staff can call the next group straight away.' })}</div><div class="flex-fill">${field('Flag a ticket when its page has been closed for', '20', { suf: 'min', type: 'number', help: 'Flagged tickets turn amber on the Queue page.' })}</div></div>
  <div class="d-flex align-items-center gap-3">${toggle('Ask "Are you still here?" when 2 groups are ahead', true)}<span>Ask "Are you still here?" when 2 groups are ahead</span></div>
  <div class="d-flex gap-2">${btn('Save queue rules', 'primary')}${btn('Discard changes', 'outline-secondary')}</div></div></div>`;
const staff = [
  pc('Staff · Account list', 'Staff', 'Staff accounts', { upd: false, act: btn('Add staff account', 'primary', { i: 'plus-lg' }), note: 'Accounts are deactivated, not deleted, so past transactions keep their staff name. The kitchen tablet uses its own Cashier-role account.' }, `
    ${tbl(['Name', 'Staff ID', 'Role', 'Status', 'Last sign-in', { h: '', ...R }], [
      srow('Mei Ling', 'meiling', 'Owner', 'Active', 'Today, 9:02 am'), srow('Aina', 'aina', 'Cashier', 'Active', 'Today, 10:55 am'), srow('Kumar', 'kumar', 'Cashier', 'Active', 'Today, 4:58 pm'),
      srow('Kitchen tablet', 'kitchen', 'Cashier', 'Active', 'Today, 10:30 am'), srow('Farah', 'farah', 'Cashier', 'Inactive', '28 Sep 2026', 'qs-void')])}`),
  pc('Settings · Rates', 'Settings', 'Settings', { upd: false, note: 'Both rates default to 0%. The example line shows the owner the effect before saving.' }, rates(false)),
  pc('Settings · Walk-in queue rules', 'Settings', 'Settings', { upd: false, note: 'The party limit follows the largest table by default instead of a fixed number. The hold time no longer blocks the queue, and closed ticket pages are flagged so staff can remove people who left.' }, queueRules),
  pc('Settings · Rate out of range', 'Settings', 'Settings', { upd: false, note: 'Rates outside 0 to 20% are refused under the field. The other field keeps its value.' }, rates(true)),
];

export default [
  section('owner-home', 'Home (owner)', 'Owner, PC · Shared', home),
  section('table-setup', 'Table setup and QR', 'Owner, PC · Table module (Clement)', tablesQr),
  section('menu-management', 'Menu management', 'Owner, PC · Menu module (Zi Chen)', menu),
  section('inventory', 'Inventory', 'Owner, PC · Inventory module (Zi Chen)', inventory),
  section('reports', 'Transactions and reports', 'Owner, PC · Payment module (Zheng Yang)', reports),
  section('vouchers', 'Vouchers', 'Owner, PC · Membership module (Zheng Yang)', vouchers),
  section('staff-settings', 'Staff accounts and settings', 'Owner, PC · Shared', staff),
];

function stat(label, value, sub) {
  const ic = {"Orders today": "clipboard2-check", "Open tables": "grid-3x3-gap", "Queue": "people", "Sales today": "wallet2", "Revenue": "wallet2", "Average bill": "receipt", "Voids and refunds": "slash-circle", "Ingredients": "box-seam", "Below minimum": "exclamation-triangle-fill", "Last stock-in": "box-arrow-in-down", "Used by recipes": "clipboard2-check", "Recorded waste": "clipboard-minus", "Not explained": "question-circle"}[label] || 'info-circle';
  const tone = label === 'Below minimum' ? 'red' : label === 'Voids and refunds' ? 'gray' : label === 'Recorded waste' ? 'c-orange' : label === 'Not explained' ? 'wait' : '';
  return `<div class="qs-stat">${tile(ic, tone, 'lg')}<div class="min-w-0"><span>${label}</span><b>${value}</b><span>${sub}</span></div></div>`;
}
