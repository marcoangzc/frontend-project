import { food } from './food.mjs';
import { uid, tile, mod, i, btn, badge, reward, field, check, kv, alert, upd, step, qr, chd, ph, section } from './lib.mjs';

const qh = chd('Walk-in queue', false);
const plain = chd('', false);
const center = (html, cls = '') => `<div class="text-center d-flex flex-column align-items-center gap-2 ${cls}">${html}</div>`;

/* ---------- Join queue ---------- */
// The party limit is the largest table in Table setup (T13 seats 8), or the owner's own limit in Settings. Never hard-coded.
const MAXPAX = 8;
const partyField = (q) => `<div><div class="form-label" id="pax-l">Party size</div>
  <div class="d-flex align-items-center justify-content-between gap-3">${step(q, { lg: 1, min: q === 1, max: q >= MAXPAX, label: 'Party size' })}<span class="small text-secondary text-end">1 to ${MAXPAX} people</span></div>
  ${q >= MAXPAX ? `<div class="mt-2">${alert('warning', `More than ${MAXPAX} people?`, `Please ask staff at the counter.`, 'people')}</div>` : `<div class="form-text">Our largest table seats ${MAXPAX}.</div>`}</div>`;
const joinForm = (err) => ph(`Join queue · ${err ? 'Party size invalid (over the limit)' : 'Form'}`, {
  url: 'quickserve.my/q', head: qh,
  bar: btn('Get my queue number', 'primary', { lg: 1, block: 1 }),
  note: err ? `The limit comes from the largest table in Table setup (T13, ${MAXPAX} seats), or from the owner's own limit in Settings, so it changes when tables change. The + button stops at the limit, so an invalid number can't be entered; the message says what to do instead.` : 'Opened by the queue QR at the door. No login, one task on the screen. Party size uses + and − instead of typing, so it can\'t be left empty or set to 0.',
}, `
  <h1 class="h-page">Join the queue</h1>
  ${alert('secondary', '6 groups in the queue', 'We will call your number on this page.', 'people')}
  ${field('Your name', 'Nurul')}
  ${partyField(err ? MAXPAX : 4)}`);

/* ---------- My ticket ---------- */
const turl = 'quickserve.my/q/A023';
const qhead = `<header class="qs-qhead"><div class="qs-qlogo">${i('shop')}</div><div class="qs-qname">Restoran Sri Melur</div><div class="qs-qsub"><span class="live"></span>Live queue</div></header>`;
const qcard = (state, o = {}) => `<section class="qs-qcard2 ${state}" aria-label="Your queue ticket">
  <div class="lbl">${o.lbl || 'Your queue number'}</div>
  <div class="no${state === 'gone' ? ' text-decoration-line-through' : ''}">A023</div>
  <div class="meta"><span>${i('people-fill')} 4 pax</span><span class="dot"></span><span>${o.status || 'Waiting'}</span>${o.edit ? '<button type="button" class="pill">Edit pax</button>' : ''}</div>
  <div class="time">${o.time || 'Joined 17 Nov 2026, 7:31 pm'}</div>
</section>`;
const qcount = `<div class="qs-list"><div>${tile('people-fill', 'gray')}<span class="flex-grow-1 fw-semibold">Groups ahead of you</span><span class="num">3</span></div></div>`;
const keepOpen = alert('secondary', 'Keep this page open', 'It turns teal when it is your turn.', 'phone');
const ticket = [
  ph('My ticket · Waiting', { url: turl, head: qhead, bar: btn('Leave the queue', 'outline-secondary', { block: 1 }), note: 'Only what the customer needs: their number, party size and how many groups are queuing. No other tickets are listed. The count refreshes by polling within 5 s.' }, `
    ${qcard('waiting', { edit: 1 })}
    ${qcount}
    ${keepOpen}
    <div class="text-center">${upd()}</div>`),
  ph('My ticket · Edit pax', { url: turl, head: qhead, sheet: 1, note: 'Party size can change while waiting. The place in the queue stays the same.',
    modal: mod('How many people?', `<div class="d-flex align-items-center justify-content-between"><span class="fw-semibold">Party size</span>${step(5, { label: 'Party size' })}</div><div class="small text-secondary">1 to ${MAXPAX} people. Your place is kept.</div>`, btn('Cancel', 'outline-secondary') + btn('Save', 'primary')) }, qcard('waiting')),
  ph('My ticket · Leave the queue?', { url: turl, head: qhead, sheet: 1, note: 'Leaving cannot be undone, so it asks once. Staying is the default button.',
    modal: mod('Leave the queue?', `<div>A023 will be cancelled.</div>`, btn('Stay in queue', 'outline-secondary') + btn('Leave queue', 'danger')) }, qcard('waiting')),
  ph('My ticket · Are you still here?', { url: turl, head: qhead, sheet: 1, note: 'Shown when 2 groups are ahead. "I\'m here" tells staff this group is still nearby, so staff can tell real customers from people who took a number and left.',
    modal: mod('Are you still nearby?', `<div class="d-flex flex-column align-items-center text-center gap-2">${tile('person-check', 'c-blue', 'xl')}<div>2 groups ahead of you.</div></div>`, btn('Leave the queue', 'outline-secondary') + btn('I\'m here', 'primary', { i: 'check-lg' })) }, qcard('waiting')),
  ph('My ticket · Called', { url: turl, head: qhead, bg: 'qs-teal', note: 'When staff tap Call, the whole page turns bright teal and the phone vibrates (Android only; iPhone browsers cannot vibrate). No sound.' }, `
    ${qcard('called', { lbl: 'Your table is ready', status: 'Called 7:37 pm', time: 'Please come to the counter now' })}
    <div class="qs-heldcard"><div class="fw-bold">Show this number to our staff</div><div class="small">Table held until 7:42 pm</div></div>`),
  ph('My ticket · Removed by staff', { url: turl, head: qhead, bar: btn('Get a new queue number', 'primary', { lg: 1, block: 1 }), note: 'Staff removed the ticket (for example the page had been closed for 20 minutes). Staff can restore it to its old place within 15 minutes, so a customer who was only away briefly is not punished.' }, `
    ${qcard('gone', { lbl: 'This ticket was cancelled', status: 'Removed by staff', time: '7:51 pm: we could not find you' })}
    ${alert('secondary', 'Still here?', 'Ask staff by 8:06 pm to restore it.', 'info-circle')}`),
  ph('My ticket · No-show', { url: turl, head: qhead, bar: btn('Get a new queue number', 'primary', { lg: 1, block: 1 }), note: 'Staff marked No-show 5 minutes after calling.' }, `
    ${qcard('gone', { lbl: 'This ticket has expired', status: 'No-show', time: 'Called 7:37 pm, released 7:42 pm' })}
    ${alert('secondary', null, 'Still here? Ask staff at the counter.')}`),
];

/* ---------- Customer menu ---------- */
const CAT = { rice: 'egg-fried', noodle: 'basket2-fill', roti: 'cookie', drink: 'cup-hot-fill', cold: 'cup-straw', dessert: 'cake2-fill' };
const dish = (name, desc, price, c, o = {}) => `
  <div class="qs-dish${o.out ? ' out' : ''}">
    ${o.img === 'loading' ? `<span class="qs-ph loading" aria-label="Photo loading">${i(CAT[c])}</span>` : o.img ? `<span class="qs-ph">${food(o.img, 72)}</span>` : tile(CAT[c], 'tea')}
    <div class="flex-grow-1 min-w-0"><div class="nm">${name}${o.hot ? ` <span class="qs-spice" aria-label="Spicy">${i('fire')}</span>` : ''}</div><div class="ds">${desc}</div>
      ${o.best ? `<div class="mt">${badge(`${i('star-fill')} Best seller`, 'tea')}</div>` : ''}
      <div class="mt justify-content-between"><span class="pr">${price}</span>${o.out ? `${badge('Sold out today', 'neutral')}<button type="button" class="qs-add" disabled aria-label="${name} is sold out">${i('plus-lg')}</button>` : o.q ? step(o.q) : `<button type="button" class="qs-add" aria-label="Add ${name}">${i('plus-lg')}</button>`}</div></div>
  </div>`;
const cat = (l, icon, on) => `<button type="button" class="qs-cat${on ? ' on' : ''}"${on ? ' aria-pressed="true"' : ''}>${tile(icon, 'tea', 'sm')}${l}</button>`;
const menuList = (loading) => { const P = (id) => (loading ? 'loading' : id); return `
    <div class="qs-search">${i('search')} Search nasi lemak, teh tarik…</div>
    <div class="qs-chips">${cat('Popular', 'star-fill', 1)}${cat('Rice', 'egg-fried')}${cat('Noodles', 'basket2-fill')}${cat('Roti', 'cookie')}${cat('Drinks', 'cup-hot-fill')}${cat('Desserts', 'cake2-fill')}</div>
    <section class="d-flex flex-column gap-2"><h2 class="h-sec">Popular</h2><div class="qs-dishes">
      ${dish('Nasi Lemak Ayam', 'Coconut rice, fried chicken, sambal, egg', 'RM9.50', 'rice', { best: 1, hot: 1, q: 2, img: P('nasi-lemak') })}
      ${dish('Mee Goreng Mamak', 'Fried yellow noodles, tofu, potato, egg', 'RM8.00', 'noodle', { best: 1, hot: 1, q: 1, img: P('mee-goreng') })}
      ${dish('Nasi Goreng Kampung', 'Village fried rice with anchovies', 'RM8.50', 'rice', { out: 1, img: P('nasi-goreng') })}
      ${dish('Roti Canai (2 pcs)', 'Served with dhal and fish curry', 'RM3.00', 'roti', { best: 1 })}</div></section>
    <section class="d-flex flex-column gap-2"><h2 class="h-sec">Drinks</h2><div class="qs-dishes">
      ${dish('Teh Tarik', 'Hot pulled milk tea', 'RM2.80', 'drink', { best: 1, q: 3, img: P('teh-tarik') })}
      ${dish('Milo Ais', 'Iced chocolate malt drink', 'RM3.50', 'cold', { img: P('milo-ais') })}</div></section>`; };
const cartbar = `<a href="#" class="qs-cartbar text-decoration-none"><span class="n">6</span><span class="flex-grow-1">View cart</span><span>RM35.40</span></a>`;
const detail = mod('Nasi Lemak Ayam', `
  <div class="qs-ph wide">${food('nasi-lemak', 328, 200)}</div>
  <div class="d-flex flex-wrap align-items-center gap-2">${badge(`${i('star-fill')} Best seller`, 'tea')}<span class="qs-spice">${i('fire')} Spicy</span></div>
  <div class="text-body-secondary">Coconut rice with fried chicken, sambal, a fried egg, cucumber, peanuts and anchovies.</div>
  ${btn('Add a note for the kitchen', 'link', { i: 'plus-lg', c: 'align-self-start px-0' })}
  <div class="d-flex align-items-center justify-content-between"><span class="fs-4 fw-bold">RM9.50</span>${step(1, { min: 1 })}</div>`, btn('Add to cart · RM9.50', 'primary', { lg: 1, block: 1 }));
const menu = [
  ph('Menu · Browsing', { bar: cartbar, note: 'Dishes show the photo the merchant uploaded. A dish without a photo (Roti Canai) falls back to its category icon, so the list never shows a broken image. Sold-out dishes stay visible but greyed out.' }, menuList(false)),
  ph('Menu · Photos still loading', { bar: cartbar, note: 'On slow data the names, prices and Add buttons appear first; each photo fades in when it arrives. Thumbnails are about 10 KB each, so a 30-dish menu costs around 300 KB.' }, menuList(true)),
  ph('Menu · Dish detail', { bar: cartbar, sheet: 1, modal: detail, note: 'Tapping a dish opens a larger photo and the full description. The larger image (about 60 KB) only loads here, not in the list.' }, menuList(false)),

  ph('Menu · Waiter called', { head: chd('Table T3', 'called'), bar: cartbar, note: 'Right after tapping Call waiter. The button turns into "Waiter called" and stays disabled until a staff member taps Done on the Tables page, so repeated taps do not send more calls.' }, `${alert('primary', 'A waiter is coming to T3', null, 'bell-fill')}${menuList(false)}`),
  ph('Menu · QR expired', { head: plain, note: 'Shown instead of the menu when the table token was replaced after payment.' }, `
    ${center(`${tile('qr-code', 'gray', 'xl')}<h1 class="fs-4 mt-2">This QR code has expired</h1><div class="text-body-secondary">This table is paid. Ask staff for help.</div>`, 'py-5')}`),
];

/* ---------- Cart and order status ---------- */
const steps = (n) => `<div class="qs-steps">
  <div class="done"><div class="dot">${i('check-lg')}</div>Sent</div>
  <div class="${n >= 1 ? 'done' : 'now'}"><div class="dot">${i(n >= 1 ? 'check-lg' : 'clock')}</div>Confirmed</div>
  <div class="${n >= 2 ? 'done' : n === 1 ? 'now' : ''}"><div class="dot">${n >= 2 ? i('check-lg') : n === 1 ? i('clock') : ''}</div>Served</div></div>`;
const summary = `<div class="card"><div class="card-body d-flex flex-column gap-2 small">
  <div class="d-flex justify-content-between align-items-center"><h2 class="fs-6">Order #1042</h2><span class="text-secondary">7:21 pm</span></div>
  ${kv('2 × Nasi Lemak Ayam', 'RM19.00')}<div class="text-secondary">Note: less spicy</div>${kv('1 × Mee Goreng Mamak', 'RM8.00')}${kv('3 × Teh Tarik', 'RM8.40')}
  <hr class="my-1">${kv('Total incl. service charge and SST', 'RM41.28', 'fw-semibold')}${kv('<span class="text-secondary">Paying by</span>', 'Card or e-wallet')}</div></div>`;
const cartItem = (name, price, q, note) => `<div class="d-flex flex-column gap-2 pb-3 border-bottom">
  <div class="d-flex justify-content-between fw-medium"><span>${name}</span><span>${price}</span></div>
  <div class="d-flex justify-content-between align-items-center">${step(q, { min: q === 1 })}${btn('Remove', 'link')}</div>
  ${note ? `<div class="qs-note">${i('chat-left-text')}<span>${note}</span>${btn('Edit', 'link')}</div>` : btn('Add a note for the kitchen', 'link', { i: 'plus-lg', c: 'align-self-start px-0' })}</div>`;
const opt = (on, title, desc, icon, g) => `<label class="qs-opt${on ? ' on' : ''}">${tile(icon, on ? 'solid' : 'gray')}<span class="flex-grow-1"><span class="d-block fw-semibold">${title}</span><span class="d-block small text-body-secondary">${desc}</span></span><input class="form-check-input mt-0 flex-shrink-0" type="radio" name="${g}"${on ? ' checked' : ''}></label>`;
const totals = (rows, total) => `<div class="d-flex flex-column gap-1 small">${rows.map((r) => kv(r[0], r[1], r[2] || '')).join('')}<hr class="my-1">${kv('Total', total, 'fs-5 fw-semibold')}</div>`;
const status = (name, n, al, bar, note) => ph(`Order status · ${name}`, { bar, note }, `<h1 class="fs-4">Order status</h1>${steps(n)}${al}${summary}<div class="text-center">${upd()}</div>`);
const cart = [
  ph('Cart · Review order', { bar: btn('Send order · RM41.28', 'primary', { lg: 1, block: 1 }), note: 'Quantity is limited to 1 to 20 per dish. Notes stay folded behind a link until the customer adds one. The payment method is chosen here, before the order is sent.' }, `
    <h1 class="fs-4">Your order</h1>
    ${cartItem('Nasi Lemak Ayam', 'RM19.00', 2, 'Less spicy')}${cartItem('Mee Goreng Mamak', 'RM8.00', 1)}${cartItem('Teh Tarik', 'RM8.40', 3, '1 kurang manis')}
    ${totals([['Subtotal', 'RM35.40'], ['Service charge (10%)', 'RM3.54'], ['SST (6%)', 'RM2.34']], 'RM41.28')}
    <fieldset class="d-flex flex-column gap-2"><legend class="fs-6 fw-semibold mb-0">How will you pay?</legend>
      ${opt(1, 'Card or e-wallet', 'Pay here after staff confirm.', 'credit-card', 'how')}
      ${opt(0, 'Cash at the counter', 'Quote table T3 to the cashier.', 'cash', 'how')}</fieldset>`),
  status('Waiting for confirmation', 0, alert('warning', 'Waiting for staff to confirm', null), btn('Add more dishes', 'outline-primary', { block: 1 }), 'Every QR order waits here until staff confirm it. Status changes arrive by polling.'),
  status('Confirmed', 1, alert('primary', 'Confirmed by Aina at 7:23 pm', 'The kitchen is preparing your food.'), btn('Pay now · RM41.28', 'primary', { lg: 1, block: 1 }) + btn('Add more dishes', 'outline-primary', { block: 1 }), 'Pay now appears because the customer chose card or e-wallet.'),
  ph('Order status · Changed by staff', { bar: btn('OK, continue', 'primary', { lg: 1, block: 1 }) + btn('Ask a waiter', 'outline-secondary', { block: 1, i: 'bell' }), note: 'When staff edit a pending order (here because only enough egg was left for one plate), the customer sees exactly what changed and the new total before the kitchen starts.' }, `
    <h1 class="fs-4">Order status</h1>${steps(0)}
    ${alert('warning', 'Staff changed your order', 'Nasi Lemak Ayam cut to 1: not enough egg.', 'pencil')}
    <div class="card"><div class="card-body d-flex flex-column gap-2 small"><h2 class="fs-6">Order #1042</h2>
      ${kv('<span><span class="qs-was">2</span> 1 × Nasi Lemak Ayam</span>', '<span><span class="qs-was">RM19.00</span> RM9.50</span>')}${kv('1 × Mee Goreng Mamak', 'RM8.00')}${kv('3 × Teh Tarik', 'RM8.40')}<hr class="my-1">
      ${kv('New total incl. service charge and SST', '<span><span class="qs-was">RM41.28</span> RM30.20</span>', 'fw-semibold')}</div></div>`),
  ph('Order status · Waiter already called', { head: chd('Table T3', 'called'), bar: btn('Add more dishes', 'outline-primary', { block: 1 }), note: 'Blocked state for Call waiter: while a call is open the button stays disabled on every table page, here the order status page.' }, `<h1 class="fs-4">Order status</h1>${steps(1)}${alert('primary', 'Waiter called 2 min ago', null, 'bell-fill')}${summary}<div class="text-center">${upd()}</div>`),
  ph('Order status · Rejected by staff', { bar: btn('Ask a waiter', 'primary', { lg: 1, block: 1, i: 'bell' }) + btn('Back to menu', 'outline-primary', { block: 1 }), note: 'The reason staff picked when rejecting is shown word for word. Nothing was charged and no stock was deducted.' }, `
    <h1 class="fs-4">Order status</h1>
    ${alert('danger', 'Your order was not accepted', 'Reason: duplicate of order #1041.', 'x-circle')}
    <div class="card"><div class="card-body d-flex flex-column gap-2 small text-secondary"><div class="d-flex justify-content-between align-items-center"><h2 class="fs-6 text-body">Order #1042</h2>${badge('Not accepted', 'neutral')}</div>${kv('2 × Nasi Lemak Ayam', 'RM19.00')}${kv('1 × Mee Goreng Mamak', 'RM8.00')}${kv('3 × Teh Tarik', 'RM8.40')}</div></div>`),
  status('Served', 2, alert('primary', 'All dishes served', 'Pay whenever you are ready.'), btn('Pay now · RM41.28', 'primary', { lg: 1, block: 1 }), ''),
];

/* ---------- Payment (customer side) ---------- */
const items = `<div class="d-flex flex-column gap-1 small">${kv('2 × Nasi Lemak Ayam', 'RM19.00')}${kv('1 × Mee Goreng Mamak', 'RM8.00')}${kv('3 × Teh Tarik', 'RM8.40')}</div>`;
const methods = (sel) => { const g = uid(); return `<fieldset class="d-flex flex-column gap-2"><legend class="fs-6 fw-semibold mb-0">Pay with</legend>
  ${opt(sel === 0, 'Card', 'Visa or Mastercard', 'credit-card', g)}${opt(sel === 1, 'E-wallet', 'Touch \'n Go, GrabPay, Boost', 'wallet2', g)}${opt(sel === 2, 'Cash at the counter', 'Quote table T3 to the cashier.', 'cash', g)}</fieldset>`; };
const sandbox = '<div class="small text-secondary text-center">Sandbox payment. No real money is charged.</div>';
const withVoucher = [['Subtotal', 'RM35.40'], ['Voucher RAYA5', '−RM5.00', 'text-primary fw-medium'], ['Service charge (10%)', 'RM3.04'], ['SST (6%)', 'RM2.01']];
const voucherOn = `<div class="alert alert-primary d-flex align-items-center gap-2 mb-0"><span class="qs-ai">${i('ticket-perforated')}</span><div class="flex-grow-1"><div class="fw-semibold">RAYA5 applied</div></div>${btn('Remove', 'link', { c: 'p-0' })}</div>`;
const memberOn = `<div class="qs-opt">${tile('person-badge-fill')}<span class="flex-grow-1"><span class="d-block fw-semibold">Siti Aminah</span><span class="d-block small">${badge('1,205 pts', 'tea')}</span></span>${btn('Change', 'link', { c: 'p-0' })}</div>`;
const payment = [
  ph('Payment · Bill', { bar: btn('Pay RM41.28', 'primary', { lg: 1, block: 1, i: 'lock' }) + sandbox, note: 'Service charge and SST are separate lines at the owner\'s rates. Voucher and member phone are optional.' }, `
    <h1 class="fs-4">Your bill</h1>${items}
    ${totals([['Subtotal', 'RM35.40'], ['Service charge (10%)', 'RM3.54'], ['SST (6%)', 'RM2.34']], 'RM41.28')}
    <div class="d-flex gap-2 align-items-end">${field('Voucher code', 'Enter code', { ph: 1, c: 'flex-grow-1' })}${btn('Apply', 'outline-primary')}</div>
    ${field('Member phone (optional)', '012-345 6789', { ph: 1, type: 'tel' })}
    ${methods(0)}`),
  ph('Payment · Member found', { bar: btn('Pay RM35.45', 'primary', { lg: 1, block: 1, i: 'lock' }) + sandbox, note: 'Once the member phone matches, the member name and points balance appear. Points are earned after payment (1 per RM1, rounded down). They are never used as a discount: members exchange them for reward dishes at the counter.' }, `
    <h1 class="fs-4">Your bill</h1>${items}
    ${totals(withVoucher, 'RM35.45')}
    ${voucherOn}${memberOn}
    ${methods(0)}`),
  ph('Payment · Bill with a reward', { bar: btn('Pay RM9.33', 'primary', { lg: 1, block: 1, i: 'lock' }) + sandbox, note: 'Next visit (18 Nov): the cashier redeemed a Teh Tarik for 200 points. It shows with a Reward tag at RM0.00 and earns nothing; this bill earns 9 points. 8.00 + service 0.80 + SST 0.53 = 9.33.' }, `
    <h1 class="fs-4">Your bill</h1>
    <div class="d-flex flex-column gap-1 small">${kv('1 × Mee Goreng Mamak', 'RM8.00')}${kv(`1 × Teh Tarik ${reward(false)}`, 'RM0.00')}</div>
    ${totals([['Subtotal', 'RM8.00'], ['Service charge (10%)', 'RM0.80'], ['SST (6%)', 'RM0.53']], 'RM9.33')}
    <div class="qs-opt">${tile('person-badge-fill')}<span class="flex-grow-1"><span class="d-block fw-semibold">Siti Aminah</span><span class="d-block small">${badge('1,040 pts', 'tea')}</span></span></div>
    ${methods(0)}`),
  ph('Payment · Voucher expired', { bar: btn('Pay RM41.28', 'primary', { lg: 1, block: 1, i: 'lock' }) + sandbox, note: 'An expired code is refused under the field with its end date. The bill stays as it was and the customer can still pay.' }, `
    <h1 class="fs-4">Your bill</h1>${items}
    ${totals([['Subtotal', 'RM35.40'], ['Service charge (10%)', 'RM3.54'], ['SST (6%)', 'RM2.34']], 'RM41.28')}
    <div class="d-flex gap-2 align-items-start">${field('Voucher code', 'MERDEKA10', { c: 'flex-grow-1', err: 'MERDEKA10 expired on 31 Aug 2026.' })}<div style="padding-top:30px">${btn('Apply', 'outline-primary')}</div></div>
    ${methods(0)}`),
  ph('Payment · Card sandbox', { url: 'sandbox.paygate.my/checkout', head: `<header class="qs-chd qs-gw"><div class="flex-grow-1"><div class="qs-chd-t">PayGate</div><div class="qs-chd-s">Paying Restoran Sri Melur</div></div>${badge('Test mode', 'outline')}</header>`, bar: btn('Pay RM35.45', 'primary', { lg: 1, block: 1 }) + btn('Cancel and go back', 'link', { block: 1 }), note: 'The gateway\'s own sandbox page. Shown so the hand-off and return are designed, not to restyle the gateway.' }, `
    <div><div class="small text-secondary">Amount</div><div class="qs-mid">RM35.45</div><div class="small text-secondary">Table T3 · Order #1042</div></div>
    ${field('Card number', '4242 4242 4242 4242')}
    <div class="d-flex gap-3">${field('Expiry', '12 / 28', { c: 'flex-grow-1' })}${field('CVC', '123', { c: 'flex-grow-1' })}</div>
    ${field('Name on card', 'Nurul Izzah')}`),
  ph('Payment · Failed', { bar: btn('Try again · RM35.45', 'primary', { lg: 1, block: 1 }) + sandbox, note: 'The error says what happened, that no money was taken, and what to do next. The bill and voucher are kept.' }, `
    <h1 class="fs-4">Your bill</h1>
    ${alert('danger', 'Payment failed', 'Card declined. You have not been charged.')}
    ${totals(withVoucher, 'RM35.45')}
    ${methods(0)}`),
  ph('Payment · Cash at counter', { bar: btn('Pay by card or e-wallet instead', 'outline-primary', { block: 1 }), note: 'Shown when the customer chose cash. The page waits (polling) and opens the e-receipt once the cashier records the payment.' }, `
    ${center(`<div class="text-body-secondary">Tell the cashier your table number</div><div class="qs-big text-primary">T3</div><div class="fs-5 fw-semibold">RM35.45 to pay</div>`, 'pt-3 gap-0')}
    ${alert('warning', 'Waiting for payment at the counter', 'Your receipt opens here after you pay.')}
    ${items}
    <div class="text-center">${upd()}</div>`),
];

/* ---------- E-receipt ---------- */
const rurl = 'quickserve.my/r/8F3K2';
const receipt = [
  ph('E-receipt · Paid', { url: rurl, head: plain, bar: btn('Split this bill', 'primary', { lg: 1, block: 1, i: 'people' }) + btn('Share receipt link', 'outline-primary', { block: 1, i: 'share' }), note: 'Opens right after payment and later from its link. The table QR token is replaced at this moment, so the old table QR now shows the expired page.' }, `
    <div class="d-flex align-items-center gap-3">${tile('check-lg', 'solid', 'lg')}<div><h1 class="fs-4 fw-bold">Paid RM35.45</h1><div class="small text-secondary">Thank you for dining with us</div></div></div>
    <div class="small text-body-secondary">Receipt R-20261117-0042<br>17 Nov 2026, 7:58 pm · Table T3 · Card ending 4242</div>
    ${items}
    ${totals(withVoucher, 'RM35.45')}
    <div class="qs-opt">${tile('star-fill', 'c-orange')}<span class="flex-grow-1"><span class="d-block fw-semibold">Points earned: +35</span><span class="d-block small text-body-secondary">Siti Aminah · Balance: 1,240</span></span></div>
    <div class="d-flex align-items-center gap-3 border rounded p-3">${qr(96, 11)}<div class="small"><div class="fw-medium">Keep this receipt</div><div class="text-break">${rurl}</div></div></div>`),
  ph('E-receipt · Split started', { url: 'quickserve.my/s/K7P2', head: plain, bar: btn('Open the split', 'primary', { lg: 1, block: 1 }), note: 'The payer has paid the full bill and now shares one QR or link with the table. It stays valid for 24 hours.' }, `
    <div><h1 class="fs-4">Share with your table</h1><p class="mb-0 text-body-secondary">Each diner scans and ticks what they ate.</p></div>
    <div class="d-flex justify-content-center py-2">${qr(200, 23)}</div>
    <div class="d-flex gap-2 align-items-end">${field('Split link', 'quickserve.my/s/K7P2', { c: 'flex-grow-1' })}${btn('Copy', 'outline-primary')}</div>
    ${alert('secondary', null, 'Valid until 18 Nov, 7:58 pm', 'clock')}`),
];

/* ---------- Split bill ---------- */
const surl = 'quickserve.my/s/K7P2';
const shd = (who) => `<header class="qs-chd"><div class="flex-grow-1 min-w-0"><div class="qs-chd-k">Restoran Sri Melur, table T3</div><div class="qs-chd-t">Split the bill</div><div class="qs-chd-s">RM35.45 paid by Nurul</div></div>${who ? badge(who, 'brand') : ''}</header>`;
const portion = (on, name, who, price, o = {}) => `<label class="qs-opt${on ? ' on' : ''}${o.un ? ' warn' : ''}"><input class="form-check-input mt-0 flex-shrink-0" type="checkbox"${on ? ' checked' : ''}><span class="flex-grow-1"><span class="d-block fw-medium">${name}</span><span class="d-block small ${o.un ? 'fw-medium' : 'text-body-secondary'}"${o.un ? ' style="color:#664D03"' : ''}>${who}</span></span><span class="small fw-semibold text-nowrap">${price}</span></label>`;
const split = [
  ph('Split bill · Join with name', { url: surl, head: shd(), bar: btn('Join the split', 'primary', { lg: 1, block: 1 }), note: 'Opened by the split QR or link. Names must be unique within the split; a taken name shows "Nurul is already in this split. Add an initial, for example Nurul A."' }, `
    <div><h1 class="h-page">Who are you?</h1><p class="mb-0 text-body-secondary">No account needed.</p></div>
    ${field('Your name', 'Wei Jie', { help: 'Already here: Nurul, Kavitha' })}`),
  ph('Split bill · Name already taken', { url: surl, head: shd(), bar: btn('Join the split', 'primary', { lg: 1, block: 1 }), note: 'Names must be unique within one split so claims are not mixed up. The error suggests a fix.' }, `
    <div><h1 class="h-page">Who are you?</h1><p class="mb-0 text-body-secondary">No account needed.</p></div>
    ${field('Your name', 'Nurul', { err: 'Nurul is taken. Try Nurul A.' })}`),
  ph('Split bill · Claiming (live)', { url: surl, head: shd('Wei Jie'), bar: kv('Your share so far', 'RM16.32', 'fs-5 fw-semibold') + '<div class="small text-body-secondary">Includes voucher, service charge and SST.</div>', note: 'Every phone shows everyone\'s ticks within 5 s. A dish with quantity 2 is listed as (1) and (2). A portion ticked by several people is divided equally.' }, `
    <div class="d-flex justify-content-between align-items-center"><h1 class="fs-5">Tick what you ate</h1>${upd()}</div>
    ${portion(0, 'Nasi Lemak Ayam (1)', 'Nurul', 'RM9.50')}
    ${portion(1, 'Nasi Lemak Ayam (2)', 'You', 'RM9.50')}
    ${portion(1, 'Mee Goreng Mamak', 'Kavitha and you · RM4.00 each', 'RM8.00')}
    ${portion(0, 'Teh Tarik (1)', 'Nurul', 'RM2.80')}
    ${portion(1, 'Teh Tarik (2)', 'You', 'RM2.80')}
    ${portion(0, 'Teh Tarik (3)', 'Not claimed yet', 'RM2.80', { un: 1 })}`),
  ph('Split bill · Unclaimed blocks completion', { url: surl, head: shd('Nurul · payer'), bar: btn('Complete split', 'primary', { lg: 1, block: 1, dis: 1 }) + '<div class="small text-center" style="color:#664D03">Unclaimed: Teh Tarik (3)</div>', note: 'Payer view. Only the payer can add a diner without a phone, remove someone or edit any claim. Complete split stays disabled until every portion has a claimant.' }, `
    ${alert('warning', '1 portion is not claimed', null, 'exclamation-circle-fill')}
    <div><h2 class="fs-6 mb-2">Diners</h2><div class="d-flex flex-wrap gap-2">${['Nurul (you)', 'Wei Jie', 'Kavitha'].map((d, j) => `<span class="badge qs-b-outline d-inline-flex align-items-center gap-2 py-2">${d}${j ? i('x-lg') : ''}</span>`).join('')}</div></div>
    ${btn('Add a diner without a phone', 'outline-primary', { i: 'person-plus', block: 1 })}
    <h2 class="fs-6">Portions</h2>
    ${portion(1, 'Nasi Lemak Ayam (1)', 'You', 'RM9.50')}
    ${portion(0, 'Nasi Lemak Ayam (2)', 'Wei Jie', 'RM9.50')}
    ${portion(0, 'Mee Goreng Mamak', 'Kavitha', 'RM8.00')}
    ${portion(1, 'Teh Tarik (1)', 'You', 'RM2.80')}
    ${portion(0, 'Teh Tarik (2)', 'Wei Jie', 'RM2.80')}
    <div class="d-flex gap-2 align-items-stretch"><div class="flex-grow-1">${portion(0, 'Teh Tarik (3)', 'Not claimed yet', 'RM2.80', { un: 1 })}</div>${btn('Assign', 'outline-primary')}</div>`),
  ph('Split bill · My share and receipt', { url: 'quickserve.my/s/K7P2/wei-jie', head: shd('Wei Jie'), bar: btn('Share my receipt', 'outline-primary', { block: 1, i: 'share' }), note: 'Shares add up exactly to the bill: 12.32 + 12.32 + 10.81 = 35.45. Any rounding cent goes to the last share (Kavitha).' }, `
    <div class="d-flex align-items-center gap-3">${tile('check-lg', 'solid', 'lg')}<h1 class="fs-4 fw-bold">Split completed</h1></div>
    <div><div class="small text-secondary">Your share · pay Nurul</div><div class="qs-mid">RM12.32</div></div>
    <div class="d-flex flex-column gap-1 small">${kv('Nasi Lemak Ayam (2)', 'RM9.50')}${kv('Teh Tarik (2)', 'RM2.80')}${kv('Voucher RAYA5 (your part)', '−RM1.74', 'text-primary fw-medium')}${kv('Service charge (10%)', 'RM1.06')}${kv('SST (6%)', 'RM0.70')}<hr class="my-1">${kv('Your share', 'RM12.32', 'fs-5 fw-semibold')}</div>
    <div class="card"><div class="card-body d-flex flex-column gap-1 small"><h2 class="fs-6 mb-1">Everyone</h2>${kv('Nurul (paid the bill)', 'RM12.32')}${kv('Wei Jie (you)', 'RM12.32', 'fw-semibold')}${kv('Kavitha', 'RM10.81')}<hr class="my-1">${kv('Bill total', 'RM35.45', 'fw-semibold')}</div></div>
    <div class="d-flex align-items-center gap-3 border rounded p-3">${qr(96, 31)}<div class="small"><div class="fw-medium">Your e-receipt</div><div class="text-break text-body-secondary">quickserve.my/s/K7P2/wei-jie</div></div></div>`),
];

export default [
  section('join-queue', 'Join queue', 'Customer, phone · Table module (Clement)', [joinForm(false), joinForm(true)]),
  section('my-ticket', 'My ticket', 'Customer, phone · Table module (Clement)', ticket),
  section('customer-menu', 'Customer menu', 'Customer, phone · Menu module (Zi Chen)', menu),
  section('cart-status', 'Cart and order status', 'Customer, phone · Order module (Clement)', cart),
  section('payment', 'Payment', 'Customer, phone · Payment module (Zheng Yang)', payment),
  section('e-receipt', 'E-receipt', 'Customer, phone · Payment module (Zheng Yang)', receipt),
  section('split-bill', 'Split bill', 'Each diner, own phone · Payment module (Zheng Yang)', split),
];
