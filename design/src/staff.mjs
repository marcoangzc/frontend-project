import { food } from './food.mjs';
import { tile, i, btn, iconBtn, badge, field, toggle, kv, alert, upd, step, emp, mod, tabs, ph, sp, tb, ct, section } from './lib.mjs';

/* ---------- Staff login ---------- */
const login = (name, al, o = {}) => ph(`Staff login · ${name}`, { url: 'quickserve.my/staff', head: '', note: o.note }, `
  <div class="d-flex align-items-center gap-2 pt-4"><span class="qs-logo">Q</span><span class="fw-semibold">QuickServe</span></div>
  <div><h1 class="h-page">Staff sign in</h1><p class="mb-0 text-body-secondary">Restoran Sri Melur</p></div>
  ${al || ''}
  ${field('Staff ID', o.id || 'aina')}
  ${field('Password', o.pw === undefined ? 'password1' : o.pw, { type: 'password', ph: o.pw === '' })}
  ${btn('Sign in', 'primary', { lg: 1, block: 1 })}
  <div class="small text-body-secondary">Forgot your password? Ask the owner to reset it in Staff accounts.</div>`);
const logins = [
  login('Normal', '', { note: 'Same page for Cashier and Owner. The role decides which navigation appears after sign-in.' }),
  login('Wrong password', alert('danger', 'Staff ID or password is incorrect', 'Check both and try again.'), { pw: '', note: 'The message does not say which of the two is wrong. The Staff ID is kept; the password is cleared.' }),
  login('Inactive account', alert('danger', 'This account is inactive', 'Ask the owner to reactivate it in Staff accounts.'), { id: 'kumar', pw: '', note: 'Deactivated staff cannot sign in. Their past transactions stay on record.' }),
];

/* ---------- Home ---------- */
const row = (icon, label, num, sub, tone) => `<a href="#">${tile(icon, tone === 'danger-solid' ? 'red' : '')}<span class="flex-grow-1"><span class="d-block fw-semibold">${label}</span>${sub ? `<span class="d-block small text-body-secondary">${sub}</span>` : ''}</span>${tone ? badge(num, tone) : `<span class="num">${num}</span>`}${i('chevron-right')}</a>`;
const todo = (icon, text, action) => `<div>${tile(icon, 'wait')}<span class="flex-grow-1 fw-semibold">${text}</span>${btn(action, 'outline-primary', { sm: 1 })}</div>`;
const day = '<div class="d-flex justify-content-between align-items-center"><div class="small text-body-secondary">Tue 17 Nov 2026 · Aina, Cashier</div>';
const dishSwitch = (name, uses, left, on) => `<div class="d-flex align-items-center gap-3 py-2"><div class="flex-grow-1 min-w-0"><div class="fw-semibold">${name}</div><div class="small text-body-secondary">${uses}. ${left}</div></div>${toggle('Mark ' + name + ' unavailable', on)}</div>`;
const unavailSheet = mod('Mark dishes unavailable', `
  <div class="small text-body-secondary">These dishes use Egg or Santan. Switch on the ones customers should not be able to order.</div>
  <div class="d-flex flex-column">${dishSwitch('Nasi Lemak Ayam', 'Uses 1 egg and 0.2 L santan', 'Enough for about 7 more', true)}${dishSwitch('Nasi Goreng Kampung', 'Uses 1 egg', 'Enough for about 12 more', false)}${dishSwitch('Mee Goreng Mamak', 'Uses 1 egg', 'Enough for about 12 more', false)}</div>`, btn('Cancel', 'outline-secondary') + btn('Save', 'primary'));
const home = [
  sp('Home · Busy day', 'Home', 'Home', { note: 'Things that need a tap come first; the four counts below link to their pages. No charts or trend arrows.' }, `
    ${day}${upd()}</div>
    <section><h2 class="fs-6 mb-2">Needs attention</h2><div class="qs-list">
      ${todo('journal-text', '3 orders waiting to confirm', 'Review')}
      ${todo('bell', 'T7 is calling a waiter', 'Open')}
      ${todo('people', 'A019 called 2 min ago', 'Queue')}</div></section>
    <section><h2 class="fs-6 mb-2">Today</h2><div class="qs-list">
      ${row('journal-text', 'Orders', 47, '3 pending · 5 in the kitchen')}
      ${row('table', 'Open tables', '9 of 15', '4 awaiting payment')}
      ${row('people', 'Queue', 5, 'Longest wait 18 min')}
      ${row('box-seam', 'Low stock', 0, 'All ingredients above minimum')}</div></section>`),
  sp('Home · Quiet morning', 'Home', 'Home', { note: 'Zeros are shown as zeros, with one line saying what will appear here.' }, `
    <div class="d-flex justify-content-between align-items-center"><div class="small text-body-secondary">Tue 17 Nov 2026 · Aina, Cashier</div>${upd()}</div>
    <section><h2 class="fs-6 mb-2">Needs attention</h2><div class="qs-list"><div class="text-body-secondary">${tile('check-lg', 'gray')}Nothing right now. New QR orders, waiter calls and queue tickets appear here.</div></div></section>
    <section><h2 class="fs-6 mb-2">Today</h2><div class="qs-list">
      ${row('journal-text', 'Orders', 0, 'No orders yet today')}
      ${row('table', 'Open tables', '0 of 15', 'All tables free')}
      ${row('people', 'Queue', 0, 'No one waiting')}
      ${row('box-seam', 'Low stock', 0, 'All ingredients above minimum')}</div></section>`),
  sp('Home · Low-stock warning', 'Home', 'Home', { low: 2, note: 'Appears on staff and owner screens when an ingredient falls below the owner\'s minimum. The count also sits in the app bar on every page.' }, `
    <div class="d-flex justify-content-between align-items-center"><div class="small text-body-secondary">Tue 17 Nov 2026 · Aina, Cashier</div>${upd()}</div>
    <div class="alert alert-danger d-flex flex-column gap-2 mb-0" role="alert"><div class="d-flex align-items-center gap-2 fw-semibold"><span class="qs-ai">${i('exclamation-triangle-fill')}</span>2 ingredients are low</div>
      <div class="small">${kv('Egg', '12 pcs left · minimum 30')}${kv('Santan (coconut milk)', '1.5 L left · minimum 3 L')}</div>
      <div class="small">Affects Nasi Lemak Ayam, Mee Goreng Mamak and Nasi Goreng Kampung.</div>
      ${btn('Mark dishes unavailable', 'danger', { block: 1 })}</div>
    <section><h2 class="fs-6 mb-2">Today</h2><div class="qs-list">
      ${row('journal-text', 'Orders', 47, '3 pending · 5 in the kitchen')}
      ${row('table', 'Open tables', '9 of 15', '4 awaiting payment')}
      ${row('people', 'Queue', 5, 'Longest wait 18 min')}
      ${row('box-seam', 'Low stock', 2, 'Egg, Santan', 'danger-solid')}</div></section>`),
  sp('Home · Choose dishes to mark unavailable', 'Home', 'Home', { low: 2, sheet: 1, modal: unavailSheet, note: 'Opened from Mark dishes unavailable. Each dish shows roughly how many more plates the stock allows, so staff switch off only what will run out. Nothing changes until Save.' }, `
    <div class="d-flex justify-content-between align-items-center"><div class="small text-body-secondary">Tue 17 Nov 2026 · Aina, Cashier</div>${upd()}</div>`),
];

/* ---------- Queue list ---------- */
// seen: 'open' page open now | 'here' tapped I'm here | 'gone' page closed for a while (from polling heartbeats)
const SEEN = { open: ['', 'Page open'], here: ['here', 'Said "I\'m here" 1 min ago'], gone: ['gone', 'Page closed 25 min ago'] };
const qrow = (no, name, size, wait, o = {}) => {
  const sn = SEEN[o.seen || 'open'];
  return `<div class="qs-qcard${o.called ? ' called' : ''}${o.seen === 'gone' ? ' gone' : ''}">
  <div class="d-flex align-items-center gap-3"><div class="qs-qno">${no}</div><div class="flex-grow-1 min-w-0"><div class="fw-bold">${name}</div><div class="small text-body-secondary">${i('people-fill')} ${size} ${size === 1 ? 'person' : 'people'}, ${wait.toLowerCase()}</div></div>${o.called ? badge('Called', 'solid') : badge('Waiting', 'wait')}</div>
  <div class="qs-seen ${sn[0]}"><span class="pip"></span>${sn[1]}</div>
  <div class="d-flex gap-2">${o.called ? btn('No-show', 'outline-secondary', { c: 'flex-fill' }) + btn('Seated', 'primary', { c: 'flex-fill', i: 'check-lg' }) : btn('Remove', 'outline-secondary') + btn('Call ' + no, 'outline-primary', { c: 'flex-fill', i: 'megaphone' })}</div>
  ${o.called ? '<div class="small text-body-secondary">Table held until 7:42 pm. You can call the next group now; No-show can be undone for 15 minutes.</div>' : ''}</div>`;
};
const qhead = (n) => `<div class="d-flex justify-content-between align-items-center"><div class="fw-medium">${n} groups, longest wait 32 min</div>${upd()}</div>`;
const qlist = (o = {}) => `
    ${o.banner === false ? '' : `<div class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="status"><span class="qs-ai">${i('eye-slash')}</span><div class="flex-grow-1"><div class="fw-semibold">1 group may have left</div><div class="small">A021's page has been closed for 25 minutes.</div></div></div>`}
    ${qrow('A019', 'Hafiz', 2, 'Called 2 min ago', { called: 1, seen: 'here' })}
    ${qrow('A020', 'Farid', 2, 'Waiting 32 min', { seen: 'here' })}
    ${o.removed ? '' : qrow('A021', 'Mei Xin', 5, 'Waiting 28 min', { seen: 'gone' })}
    ${qrow('A022', 'Suresh', 3, 'Waiting 9 min')}
    ${qrow('A023', 'Nurul', 4, 'Waiting 4 min')}`;
const removeSheet = mod('Remove A021 from the queue?', `
  <div>Mei Xin, 5 people. Waiting 28 minutes; their page has been closed for 25 minutes.</div>
  <fieldset><legend class="form-label">Reason</legend><div class="qs-chipset"><button type="button" class="qs-chip on" aria-pressed="true">Left without telling us</button><button type="button" class="qs-chip">Took two numbers</button><button type="button" class="qs-chip">Asked to cancel</button><button type="button" class="qs-chip">Other</button></div></fieldset>
  <div class="small text-body-secondary">Their page will say the ticket was cancelled. You can restore it to the same place for 15 minutes.</div>`, btn('Keep in queue', 'outline-secondary') + btn('Remove ticket', 'danger'));
const queue = [
  sp('Queue · Several waiting', 'Queue', 'Queue', { note: 'Each ticket shows whether its page is still open (from the polling heartbeat) or the customer tapped "I\'m here". A ticket whose page has been closed for 20 minutes is flagged amber. Staff can remove any waiting ticket at any time, and can mark No-show right after calling: no forced 5-minute wait.' }, `${qhead(5)}${qlist()}`),
  sp('Queue · Remove a ticket', 'Queue', 'Queue', { sheet: 1, modal: removeSheet, note: 'Removing needs a reason (kept on record). "Took two numbers" covers people holding a ticket at more than one place.' }, `${qhead(5)}${qlist()}`),
  sp('Queue · Removed, can restore', 'Queue', 'Queue', { note: 'The removed ticket moves to "Recently removed" for 15 minutes. Restore puts it back in its old place, so a customer who stepped away briefly is not sent to the back.' }, `${qhead(4)}${qlist({ removed: 1, banner: false })}
    <section><h2 class="fs-6 mb-2">Recently removed</h2><div class="qs-list"><div>${tile('people', 'gray')}<span class="flex-grow-1"><span class="d-block fw-semibold">A021 Mei Xin, 5 people</span><span class="d-block small text-body-secondary">Left without telling us, 7:51 pm. Restore until 8:06 pm.</span></span>${btn('Restore', 'outline-secondary', { sm: 1, i: 'arrow-counterclockwise' })}</div></div></section>`),
  sp('Queue · Empty', 'Queue', 'Queue', {}, `
    <div class="d-flex justify-content-between align-items-center"><div class="fw-medium">0 groups</div>${upd()}</div>
    <div class="card">${emp('people', 'No one is waiting', 'New tickets appear here when customers scan the queue QR at the door.')}</div>`),
];

/* ---------- Table grid ---------- */
const t = (no, cls, line, o = {}) => `<a href="#" class="qs-t${cls ? ' ' + cls : ''}${o.call ? ' call' : ''}${o.sel ? ' sel' : ''}"><b>${no}</b><span>${cls === 'food' ? i('clock-fill') : cls === 'pay' ? i('wallet-fill') : ''}${line}</span>${o.call ? `<span class="bell" aria-label="Waiter called">${i('bell-fill')}</span>` : ''}</a>`;
const legend = '<div class="qs-legend"><span><i></i>Free</span><span><i class="food"></i>Waiting for food</span><span><i class="pay"></i>Awaiting payment</span></div>';
const area = (name, tiles) => `<section><h2 class="fs-6 mb-2">${name}</h2><div class="qs-tgrid">${tiles}</div></section>`;
const grid = (call, sel) => `
  ${area('Indoor', t('T1', 'pay', 'RM28.60') + t('T2', '', 'Free') + t('T3', 'food', '6 min', { sel }) + t('T4', '', 'Free') + t('T5', 'food', '11 min') + t('T6', 'pay', 'RM52.10'))}
  ${area('Outdoor', t('T7', 'food', '3 min', { call }) + t('T8', '', 'Free') + t('T9', 'pay', 'RM25.07') + t('T10', '', 'Free') + t('T11', 'food', '8 min') + t('T12', 'pay', 'RM14.30'))}
  ${area('Upstairs', t('T13', '', 'Free') + t('T14', 'food', '2 min') + t('T15', '', 'Free'))}`;
const tables = [
  sp('Tables · Live grid', 'Tables', 'Tables', { note: 'Grouped by dining area. Status is carried by a text line as well as colour: time waiting for food, or the amount to pay.' }, `
    <div class="d-flex justify-content-between align-items-center"><div class="fw-medium">9 of 15 tables open</div>${upd()}</div>${legend}${grid(false)}`),
  sp('Tables · Waiter call', 'Tables', 'Tables', { note: 'A customer tapped Call waiter on T7. The alert stays pinned until a staff member taps Done.' }, `
    <div class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert"><span class="qs-ai">${i('bell-fill')}</span><div class="flex-grow-1"><div class="fw-semibold">T7 is calling a waiter</div><div class="small">1 min ago · Outdoor</div></div>${btn('Done', 'outline-secondary', { sm: 1 })}</div>
    ${legend}${grid(true)}`),
  sp('Tables · Table detail', 'Tables', 'Tables', { sheet: 1, note: 'On a phone, tapping a table opens its order in a bottom sheet with the two actions staff need most.',
    modal: mod('T3 · Indoor', `<div class="d-flex justify-content-between align-items-center"><span class="small text-body-secondary">Order #1042, confirmed 7:23 pm by Aina</span>${badge('Waiting for food', 'wait')}</div>
      <div class="d-flex flex-column gap-1">${kv('2 × Nasi Lemak Ayam', 'RM19.00')}${kv('1 × Mee Goreng Mamak', 'RM8.00')}${kv('3 × Teh Tarik', 'RM8.40')}</div>
      <hr class="my-0">${kv('Total incl. service charge and SST', 'RM41.28', 'fw-semibold')}${kv('<span class="text-body-secondary">Paying by</span>', 'Card or e-wallet')}`, btn('Edit order', 'outline-secondary') + btn('Take payment', 'primary', { i: 'cash' })) }, `
    <div class="d-flex justify-content-between align-items-center"><div class="fw-medium">9 of 15 tables open</div>${upd()}</div>${legend}${grid(false, true)}`),
  ct('Tables · Counter tablet', 'Tables', { note: 'Same grid at 1024 px with the selected table\'s order beside it, so the cashier does not leave the page to take payment.' }, `
    <div><div class="d-flex justify-content-between align-items-center"><div class="fw-medium">9 of 15 tables open</div>${upd()}</div>${legend}${grid(false, true)}</div>
    <aside><div class="d-flex justify-content-between align-items-center"><h2 class="fs-4">T3 · Indoor</h2>${badge('Waiting for food', 'wait')}</div>
      <div class="small text-body-secondary">Order #1042 · confirmed 7:23 pm by Aina · card or e-wallet</div>
      <div class="d-flex flex-column gap-1">${kv('2 × Nasi Lemak Ayam', 'RM19.00')}<div class="small text-body-secondary">Less spicy</div>${kv('1 × Mee Goreng Mamak', 'RM8.00')}${kv('3 × Teh Tarik', 'RM8.40')}</div>
      <hr class="my-1"><div class="d-flex flex-column gap-1 small">${kv('Subtotal', 'RM35.40')}${kv('Service charge (10%)', 'RM3.54')}${kv('SST (6%)', 'RM2.34')}</div>${kv('Total', 'RM41.28', 'fs-5 fw-semibold')}
      <div class="mt-auto d-flex flex-column gap-2">${btn('Take payment', 'primary', { lg: 1, block: 1, i: 'cash' })}${btn('Edit order', 'outline-secondary', { block: 1 })}</div></aside>`),
];

/* ---------- Orders ---------- */
const order = (tbl, no, time, pay, lines, o = {}) => `<div class="card"><div class="card-body d-flex flex-column gap-2 p-3">
  <div class="d-flex align-items-center gap-2"><span class="fs-4 fw-bold lh-1">${tbl}</span><span class="flex-grow-1 small text-body-secondary">#${no} · ${time}</span>${badge(pay, 'outline')}</div>
  ${o.alert || ''}
  <div class="d-flex flex-column gap-1">${lines}</div>
  <div class="d-flex gap-2">${btn('Reject', 'outline-danger', { c: 'flex-fill' })}${btn('Edit', o.alert ? 'primary' : 'outline-secondary', { c: 'flex-fill' })}${btn('Confirm', 'primary', { c: 'flex-fill', dis: !!o.alert, i: 'check-lg' })}</div></div></div>`;
const line = (q, name, note) => `<div><span class="fw-semibold me-2">${q} ×</span>${name}${note ? `<div class="small text-body-secondary">Note: ${note}</div>` : ''}</div>`;
const o1042 = line(2, 'Nasi Lemak Ayam', 'less spicy') + line(1, 'Mee Goreng Mamak') + line(3, 'Teh Tarik', '1 kurang manis');
const o1043 = line(1, 'Nasi Goreng Kampung') + line(2, 'Roti Canai (2 pcs)') + line(2, 'Milo Ais');
const otabs = tabs(['Pending <span class="badge qs-b-wait-solid ms-2">2</span>', 'Confirmed', 'Served']);
const pending = (a) => `<div class="d-flex justify-content-between align-items-center">${otabs}</div>${upd()}${order('T3', 1042, '2 min ago', 'Card / e-wallet', o1042, { alert: a })}${order('T9', 1043, '1 min ago', 'Cash', o1043)}`;
const editRow = (name, q) => `<div class="d-flex align-items-center gap-2"><span class="flex-grow-1 fw-medium">${name}</span>${step(q)}${iconBtn('trash', 'Remove ' + name)}</div>`;
const orders = [
  sp('Orders · Pending to confirm', 'Orders', 'Orders', { note: 'Every QR order lands here first. The kitchen sees it only after Confirm, which also deducts ingredients by recipe.' }, pending()),
  sp('Orders · New order arrives', 'Orders', 'Orders', { note: 'A new QR order shows a banner on every staff page and raises the Orders badge within 5 s (polling). The banner stays until someone opens the order. A chime can be switched on for the counter tablet in Settings; it is off by default.' }, `
    <div class="alert alert-primary d-flex align-items-center gap-2 mb-0" role="status"><span class="qs-ai">${i('bell-fill')}</span><div class="flex-grow-1"><div class="fw-semibold">New order from T12</div><div class="small">2 dishes, cash, just now</div></div>${btn('Open', 'primary', { sm: 1 })}</div>
    ${pending()}`),
  sp('Orders · Insufficient stock', 'Orders', 'Orders', { low: 2, note: 'Confirm failed because a recipe needs more than is in stock. Confirm is disabled and Edit becomes the main action.' }, pending(alert('danger', 'Insufficient stock: Egg', 'This order needs 3 eggs and only 2 are left. Edit the order or reject it.'))),
  sp('Orders · Edit items', 'Orders', 'Orders', { sheet: 1, note: 'Bottom sheet within thumb reach. Saving sends the customer a new total and keeps the order Pending.',
    modal: mod('Edit order #1042 · T3', `${editRow('Nasi Lemak Ayam', 1)}${editRow('Mee Goreng Mamak', 1)}${editRow('Teh Tarik', 3)}${btn('Add a dish', 'outline-primary', { i: 'plus-lg', block: 1 })}${kv('New total', 'RM30.20', 'fs-5 fw-semibold')}`, btn('Cancel', 'outline-secondary') + btn('Save changes', 'primary')) }, pending()),
  sp('Orders · Reject', 'Orders', 'Orders', { sheet: 1, note: 'Rejecting needs a reason, which the customer sees on their order status page. Stops prank and duplicate orders.',
    modal: mod('Reject order #1043 · T9?', `${field('Reason shown to the customer', 'Duplicate order', { sel: 1 })}${field('Note (optional)', 'Add a note', { ph: 1 })}<div class="small text-body-secondary">The order is kept on record as Rejected. No stock is deducted.</div>`, btn('Keep order', 'outline-secondary') + btn('Reject order', 'danger')) }, pending()),
];

/* ---------- Kitchen view ---------- */
const ticket = (tbl, no, time, age, lines, late) => `<article class="qs-ticketk${late ? ' late' : ''}"><header><b>${tbl}</b><span>#${no}</span><span class="age">${age}</span></header><ul>${lines}</ul>${btn('Served', 'primary', { i: 'check-lg' })}</article>`;
const kl = (q, name, note) => `<li><b>${q} ×</b>${name}${note ? `<em>${note}</em>` : ''}</li>`;
const kitchen = [
  tb('Kitchen · Confirmed orders', { count: '4 orders waiting', note: 'Only confirmed orders, oldest first from the left. Read from a metre away: 24 px dish lines, 40 px table numbers, one button per ticket. A ticket turns amber after 10 minutes.' }, `
    ${ticket('T5', 1039, '7:18 pm', '11 min', kl(1, 'Nasi Lemak Ayam') + kl(2, 'Mee Goreng Mamak', '1 no egg') + kl(2, 'Teh Tarik'), true)}
    ${ticket('T11', 1040, '7:21 pm', '8 min', kl(3, 'Roti Canai (2 pcs)') + kl(3, 'Milo Ais'))}
    ${ticket('T3', 1042, '7:23 pm', '6 min', kl(2, 'Nasi Lemak Ayam', 'less spicy') + kl(1, 'Mee Goreng Mamak') + kl(3, 'Teh Tarik', '1 kurang manis'))}
    ${ticket('T7', 1044, '7:26 pm', '3 min', kl(1, 'Nasi Goreng Kampung') + kl(1, 'Teh Tarik'))}`),
  tb('Kitchen · Served with undo', { count: '3 orders waiting', note: 'Tapping Served removes the ticket at once and shows Undo for 8 seconds, because a wet hand on a wall tablet will mis-tap. The kitchen never needs a confirmation dialog.' }, `
    ${ticket('T11', 1040, '7:21 pm', '8 min', kl(3, 'Roti Canai (2 pcs)') + kl(3, 'Milo Ais'))}
    ${ticket('T3', 1042, '7:23 pm', '6 min', kl(2, 'Nasi Lemak Ayam', 'less spicy') + kl(1, 'Mee Goreng Mamak') + kl(3, 'Teh Tarik', '1 kurang manis'))}
    ${ticket('T7', 1044, '7:26 pm', '3 min', kl(1, 'Nasi Goreng Kampung') + kl(1, 'Teh Tarik'))}
    <div class="qs-toast" role="status">${i('check-circle-fill')} T5 marked served ${btn('Undo', 'band')}</div>`),
  tb('Kitchen · Record waste', { count: '4 orders waiting', note: 'For anything the recipe does not cover: dropped or spoiled food, a dish remade, or an extra portion. Big buttons for wet hands. It deducts stock and is logged as waste, separate from sales, so the owner can see where ingredients went.',
    modal: mod('Record waste', `
      <fieldset><legend class="form-label fs-6">Ingredient</legend><div class="qs-ing">
        <button type="button" class="on" aria-pressed="true">${tile('egg-fill', 'c-orange', 'lg')}<span>Egg<small>12 pcs left</small></span></button>
        <button type="button">${tile('basket-fill', 'c-brown', 'lg')}<span>Rice<small>18.4 kg left</small></span></button>
        <button type="button">${tile('droplet-fill', 'c-blue', 'lg')}<span>Santan<small>1.5 L left</small></span></button>
        <button type="button">${tile('box-seam', 'c-teal', 'lg')}<span>Chicken<small>6.2 kg left</small></span></button>
        <button type="button">${tile('basket2-fill', 'c-teal', 'lg')}<span>Noodles<small>4.5 kg left</small></span></button>
        <button type="button">${tile('search', 'gray', 'lg')}<span>Other<small>Search all 24</small></span></button></div></fieldset>
      <div class="d-flex align-items-center gap-4"><span class="form-label fs-6 mb-0">How many</span>${step('2 pcs', { lg: 1, label: 'Quantity of egg' })}</div>
      <fieldset><legend class="form-label fs-6">What happened</legend><div class="qs-chipset"><button type="button" class="qs-chip on" aria-pressed="true">Dropped</button><button type="button" class="qs-chip">Spoiled</button><button type="button" class="qs-chip">Burnt</button><button type="button" class="qs-chip">Dish remade</button><button type="button" class="qs-chip">Extra in a dish</button></div></fieldset>
      ${field('For which order? (optional, for "Dish remade" or "Extra in a dish")', 'Not linked to an order', { sel: 1 })}`, btn('Cancel', 'outline-secondary', { lg: 1 }) + btn('Record 2 eggs', 'primary', { lg: 1 }), 720) }, `
    ${ticket('T5', 1039, '7:18 pm', '11 min', kl(1, 'Nasi Lemak Ayam') + kl(2, 'Mee Goreng Mamak', '1 no egg') + kl(2, 'Teh Tarik'), true)}
    ${ticket('T11', 1040, '7:21 pm', '8 min', kl(3, 'Roti Canai (2 pcs)') + kl(3, 'Milo Ais'))}
    ${ticket('T3', 1042, '7:23 pm', '6 min', kl(2, 'Nasi Lemak Ayam', 'less spicy') + kl(1, 'Mee Goreng Mamak') + kl(3, 'Teh Tarik', '1 kurang manis'))}`),
  tb('Kitchen · None waiting', { count: '0 orders waiting', note: 'The device signs in with a staff account and stays on this page; there is no navigation to tap by mistake.' }, `
    <div class="qs-kempty">No orders waiting<div>Confirmed orders appear here within 5 seconds.</div></div>`),
];

/* ---------- Payment (cashier) ---------- */
const bill9 = `<div class="d-flex flex-column gap-1 small">${kv('1 × Nasi Goreng Kampung', 'RM8.50')}${kv('2 × Roti Canai (2 pcs)', 'RM6.00')}${kv('2 × Milo Ais', 'RM7.00')}<hr class="my-1">${kv('Subtotal', 'RM21.50')}${kv('Service charge (10%)', 'RM2.15')}${kv('SST (6%)', 'RM1.42')}</div>${kv('Total', 'RM25.07', 'fs-5 fw-semibold')}`;
const quick = (v, on) => `<button type="button" class="btn ${on ? 'btn-primary' : 'btn-outline-secondary'} flex-fill">${v}</button>`;
const cash = [
  sp('Take payment · Cash with change', 'Take payment', 'Pay', { bar: btn('Record cash payment', 'primary', { lg: 1, block: 1 }), note: 'The customer quotes the table number at the counter. Change is worked out as the cashier types. Recording the payment replaces the table\'s QR token and opens the e-receipt.' }, `
    ${field('Table', 'T9 · Outdoor · RM25.07', { sel: 1 })}
    <div class="card"><div class="card-body d-flex flex-column gap-2 p-3">${bill9}</div></div>
    <div class="d-flex gap-2 align-items-end">${field('Voucher code', 'Enter code', { ph: 1, c: 'flex-grow-1' })}${btn('Apply', 'outline-primary')}</div>
    ${field('Member phone (optional)', '012-345 6789', { ph: 1, type: 'tel' })}
    ${field('Cash tendered', '50.00', { pre: 'RM' })}
    <div class="d-flex gap-2">${quick('Exact')}${quick('RM30')}${quick('RM50', 1)}${quick('RM100')}</div>
    <div class="alert alert-primary mb-0">${kv('Change to give', 'RM24.93', 'fs-4 fw-semibold')}</div>`),
  sp('Take payment · Expired voucher', 'Take payment', 'Pay', { bar: btn('Record cash payment', 'primary', { lg: 1, block: 1, dis: 1 }), note: 'An expired or deactivated voucher is refused with its end date. The bill is unchanged.' }, `
    ${field('Table', 'T9 · Outdoor · RM25.07', { sel: 1 })}
    <div class="card"><div class="card-body d-flex flex-column gap-2 p-3">${bill9}</div></div>
    <div class="d-flex gap-2 align-items-start">${field('Voucher code', 'MERDEKA10', { c: 'flex-grow-1', err: 'MERDEKA10 expired on 31 Aug 2026.' })}<div style="padding-top:25px">${btn('Apply', 'outline-primary')}</div></div>
    ${field('Member phone (optional)', '012-345 6789', { ph: 1, type: 'tel' })}
    ${field('Cash tendered', '0.00', { pre: 'RM', ph: 1 })}`),
];

/* ---------- Void approval ---------- */
const tx = (voided) => `
  <div class="d-flex justify-content-between align-items-center"><a href="#" class="small">${i('chevron-left')} Transactions</a>${upd()}</div>
  <div class="card"><div class="card-body d-flex flex-column gap-2 p-3">
    <div class="d-flex justify-content-between align-items-center"><h2 class="fs-5">R-20261117-0038</h2>${voided ? badge('Voided', 'neutral') : badge('Paid', 'brand')}</div>
    <div class="small text-body-secondary">17 Nov 2026, 7:02 pm · Table T6 · Cash · Aina</div>
    <div class="d-flex flex-column gap-1 small">${kv('3 × Nasi Lemak Ayam', 'RM28.50')}${kv('2 × Mee Goreng Mamak', 'RM16.00')}<hr class="my-1">${kv('Subtotal', 'RM44.50')}${kv('Service charge (10%)', 'RM4.45')}${kv('SST (6%)', 'RM2.94')}</div>
    ${kv('Total', `<span class="${voided ? 'text-decoration-line-through text-secondary' : ''}">RM51.89</span>`, 'fs-5 fw-semibold')}</div></div>
  ${voided ? `<div class="alert alert-secondary mb-0"><span class="qs-ai">${i('slash-circle')}</span><div class="flex-grow-1"><div class="fw-semibold">Voided on 17 Nov 2026, 8:12 pm</div><div class="small">${kv('Requested by', 'Aina (Cashier)')}${kv('Approved by', 'Mei Ling (Owner)')}${kv('Reason', 'Charged to the wrong table')}</div></div></div><div class="small text-body-secondary">Voided transactions stay in history and reports. Nothing is deleted.</div>` : btn('Void this transaction', 'outline-danger', { block: 1 })}`;
const voidForm = (failed) => mod('Void R-20261117-0038', `
  ${failed ? alert('danger', 'Owner ID or password is incorrect', 'The transaction was not voided. Try again.') : ''}
  ${field('Reason for the void', 'Charged to the wrong table')}
  <div><div class="fw-semibold">Supervisor approval</div><div class="small text-body-secondary">The owner enters their own ID and password on this device.</div></div>
  ${field('Owner ID', 'meiling')}
  ${field('Owner password', failed ? '' : 'password1', { type: 'password', ph: failed, aria: 'Owner password' })}`, btn('Cancel', 'outline-secondary') + btn('Approve void', 'danger'));
const voids = [
  sp('Void · Supervisor prompt', 'Transactions', 'Pay', { sheet: 1, modal: voidForm(false), note: 'The cashier taps Void and gives a reason; the prompt then asks for the Owner\'s ID and password on the cashier\'s screen.' }, tx(false)),
  sp('Void · Approval failed', 'Transactions', 'Pay', { sheet: 1, modal: voidForm(true), note: 'Wrong owner credentials. The reason is kept and only the password is cleared.' }, tx(false)),
  sp('Void · Voided record', 'Transactions', 'Pay', { note: 'The record shows who, when and why. The amount is struck through, not removed.' }, tx(true)),
];

/* ---------- Menu (cashier): read only, except dish photos when the owner allows it ---------- */
// photo: image id, '' = none. o.can: cashier may add photos. o.pending / o.fresh: just-added states.
const sdish = (name, meta, img, o = {}) => `<div class="qs-dish">${img ? `<span class="qs-ph">${food(img, 72)}</span>` : tile(o.icon || 'egg-fried', 'tea')}
  <div class="flex-grow-1 min-w-0"><div class="nm">${name}</div><div class="ds">${meta}</div>
  ${o.pending ? `<div class="mt">${badge('Awaiting approval', 'wait')}</div>` : o.fresh ? `<div class="mt">${badge('Photo added', 'brand')}</div>` : ''}
  ${o.can && !img ? `<div class="mt">${btn('Add photo', 'outline-secondary', { sm: 1, i: 'camera' })}</div>` : ''}</div>
  ${o.can && img ? iconBtn('camera', 'Replace the photo of ' + name) : ''}</div>`;
const smenu = (o = {}) => {
  const roti = o.roti || '';
  const can = o.can !== false;
  return `<div class="qs-search">${i('search')} Search dishes</div>
    <div class="qs-chipset">${['All 32', 'No photo 2', 'Unavailable 1'].map((l, j) => `<button type="button" class="qs-chip${j === (o.filter || 0) ? ' on' : ''}"${j === (o.filter || 0) ? ' aria-pressed="true"' : ''}>${l}</button>`).join('')}</div>
    <div class="qs-dishes">
      ${o.filter === 1 ? '' : sdish('Nasi Lemak Ayam', 'Rice, RM9.50', 'nasi-lemak', { can })}
      ${sdish('Roti Canai (2 pcs)', 'Roti, RM3.00', roti, { can, icon: 'cookie', pending: o.pending, fresh: o.fresh })}
      ${sdish('Cendol', 'Desserts, RM4.50', '', { can, icon: 'cake2-fill' })}
      ${o.filter === 1 ? '' : sdish('Teh Tarik', 'Drinks, RM2.80', 'teh-tarik', { can })}</div>
    ${can && !o.fresh ? '<div class="small text-body-secondary">You can add or replace dish photos. Prices, recipes and new dishes are managed by the owner.</div>' : ''}`;
};
const checkPhoto = `<div class="qs-photo">${food('roti-canai', 328)}</div>
    <div class="fw-bold">Roti Canai (2 pcs)</div>
    <ul class="list-unstyled d-flex flex-column gap-2 mb-0 small">
      <li class="d-flex gap-2">${i('check-circle-fill', 'text-primary')}Whole plate inside the square</li>
      <li class="d-flex gap-2">${i('check-circle-fill', 'text-primary')}Daylight or bright light, no flash</li>
      <li class="d-flex gap-2">${i('check-circle-fill', 'text-primary')}Shot from above, plain table behind</li></ul>`;
const smenus = [
  sp('Menu · Dishes without photos', 'Menu', '', { note: 'Reached from the menu button. Cashiers can search the menu but not change it, except photos: dishes without one show Add photo, and the "No photo" filter lists the gaps.' }, smenu({ filter: 1 })),
  sp('Menu · Check the photo', 'New photo', '', { bar: btn('Use this photo', 'primary', { lg: 1, block: 1, i: 'check-lg' }) + btn('Retake', 'outline-secondary', { block: 1, i: 'camera' }), note: 'Add photo opens the phone camera directly. After the shot the cashier checks it against three simple tips before it goes on the menu. Drag to move the dish inside the square.' }, checkPhoto),
  sp('Menu · Photo added', 'Menu', '', { note: 'With approval off (the default) the photo goes on the customer menu at once. Undo is offered for 8 seconds; after that the owner can still replace or remove it.' }, `${smenu({ roti: 'roti-canai', fresh: 1 })}<div class="qs-toast ph" role="status">${i('check-circle-fill')} Photo added to Roti Canai ${btn('Undo', 'band')}</div>`),
  sp('Menu · Sent for approval', 'Menu', '', { note: 'If the owner turned on approval, the photo waits for them. Customers keep seeing the old photo, or the category icon, until it is approved.' }, `${smenu({ roti: 'roti-canai', pending: 1 })}${alert('warning', 'Sent to Mei Ling for approval', 'Customers will see the new photo once it is approved.', 'hourglass-split')}`),
  sp('Menu · Photos turned off', 'Menu', '', { note: 'When the owner switches photo uploads off for cashiers, the buttons disappear instead of failing when tapped. The server also refuses the upload.' }, `${smenu({ can: false })}${alert('secondary', null, 'Only the owner can change dish photos right now. Ask Mei Ling if you want to add one.', 'lock')}`),
];

/* ---------- Members ---------- */
const member = (name, phone, since) => `<a href="#">${tile('person-badge-fill', 'tea')}<span class="flex-grow-1"><span class="d-block fw-semibold">${name}</span><span class="d-block small text-body-secondary">${phone} · member since ${since}</span></span>${i('chevron-right')}</a>`;
const regForm = (dup) => mod('Register member', `
  ${field('Name', 'Kavitha Raj')}
  ${field('Phone number', '012-345 6789', dup ? { type: 'tel', err: 'This phone number is already registered to Siti Aminah.' } : { type: 'tel', help: 'Used to find the member at payment.' })}
  ${dup ? btn('Open Siti Aminah', 'outline-primary', { block: 1 }) : ''}`, btn('Cancel', 'outline-secondary') + btn('Register', 'primary'));
const search = (q) => `<div class="d-flex gap-2 align-items-end">${field(null, q, { aria: 'Search members by name or phone', pre: i('search'), c: 'flex-grow-1' })}</div>`;
const mlist = `<div class="small text-body-secondary">3 members match "012"</div><div class="qs-list">${member('Siti Aminah', '012-345 6789', 'Mar 2026')}${member('Tan Wei Jie', '012-880 1432', 'Jul 2026')}${member('Kumar Selvam', '016-012 7755', 'Sep 2026')}</div>`;
const members = [
  sp('Members · Search results', 'Members', '', { bar: btn('Register a member', 'primary', { block: 1, i: 'person-plus' }), note: 'Reached from the menu button. Search matches name or any part of the phone number.' }, `${search('012')}${mlist}`),
  sp('Members · No match', 'Members', '', { bar: btn('Register a member', 'primary', { block: 1, i: 'person-plus' }) }, `${search('019-55')}<div class="card">${emp('person-badge', 'No member matches "019-55"', 'Check the number, or register this customer as a new member.')}</div>`),
  sp('Members · Register', 'Members', '', { sheet: 1, modal: regForm(false), note: 'Two fields only. Members are found by phone at payment; customers never sign in.' }, `${search('012')}${mlist}`),
  sp('Members · Duplicate phone', 'Members', '', { sheet: 1, modal: regForm(true), note: 'The error names the existing member and offers to open that record.' }, `${search('012')}${mlist}`),
];

export default [
  section('staff-login', 'Staff login', 'Staff, any device · Shared', logins),
  section('home', 'Home', 'Cashier, phone · Shared', home),
  section('queue-list', 'Queue list', 'Cashier, phone · Table module (Clement)', queue),
  section('table-grid', 'Table grid', 'Cashier, phone or counter tablet · Table module (Clement)', tables),
  section('orders', 'Orders', 'Cashier, phone · Order module (Clement)', orders),
  section('kitchen-view', 'Kitchen view', 'Kitchen, tablet on the wall · Order module (Clement)', kitchen),
  section('take-payment', 'Payment at the counter', 'Cashier, phone · Payment module (Zheng Yang)', cash),
  section('void-approval', 'Void approval', 'Cashier with the Owner beside · Payment module (Zheng Yang)', voids),
  section('members', 'Members', 'Cashier or Owner, phone · Membership module (Zheng Yang)', members),
  section('staff-menu', 'Menu and dish photos', 'Cashier, phone · Menu module (Zi Chen)', smenus),
];
