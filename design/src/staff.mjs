import { i, btn, iconBtn, badge, field, kv, alert, upd, step, emp, mod, tabs, ph, sp, tb, ct, section } from './lib.mjs';

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
const row = (icon, label, num, sub, tone) => `<a href="#"><span class="flex-grow-1"><span class="d-block fw-medium">${i(icon, 'me-2 text-secondary')}${label}</span>${sub ? `<span class="d-block small text-body-secondary">${sub}</span>` : ''}</span>${tone ? badge(num, tone) : `<span class="num">${num}</span>`}${i('chevron-right')}</a>`;
const todo = (icon, text, action) => `<div><span class="flex-grow-1 fw-medium">${i(icon, 'me-2')}${text}</span>${btn(action, 'outline-primary', { sm: 1 })}</div>`;
const day = '<div class="d-flex justify-content-between align-items-center"><div class="small text-body-secondary">Tue 17 Nov 2026 · Aina, Cashier</div>';
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
    <section><h2 class="fs-6 mb-2">Needs attention</h2><div class="qs-list"><div class="text-body-secondary">Nothing right now. New QR orders, waiter calls and queue tickets appear here.</div></div></section>
    <section><h2 class="fs-6 mb-2">Today</h2><div class="qs-list">
      ${row('journal-text', 'Orders', 0, 'No orders yet today')}
      ${row('table', 'Open tables', '0 of 15', 'All tables free')}
      ${row('people', 'Queue', 0, 'No one waiting')}
      ${row('box-seam', 'Low stock', 0, 'All ingredients above minimum')}</div></section>`),
  sp('Home · Low-stock warning', 'Home', 'Home', { low: 2, note: 'Appears on staff and owner screens when an ingredient falls below the owner\'s minimum. The count also sits in the app bar on every page.' }, `
    <div class="d-flex justify-content-between align-items-center"><div class="small text-body-secondary">Tue 17 Nov 2026 · Aina, Cashier</div>${upd()}</div>
    <div class="alert alert-danger d-flex flex-column gap-2 mb-0" role="alert"><div class="fw-semibold">${i('exclamation-triangle-fill', 'me-2')}2 ingredients are low</div>
      <div class="small">${kv('Egg', '12 pcs left · minimum 30')}${kv('Santan (coconut milk)', '1.5 L left · minimum 3 L')}</div>
      <div class="small">Affects Nasi Lemak Ayam, Mee Goreng Mamak and Nasi Goreng Kampung.</div>
      ${btn('Mark dishes unavailable', 'danger', { block: 1 })}</div>
    <section><h2 class="fs-6 mb-2">Today</h2><div class="qs-list">
      ${row('journal-text', 'Orders', 47, '3 pending · 5 in the kitchen')}
      ${row('table', 'Open tables', '9 of 15', '4 awaiting payment')}
      ${row('people', 'Queue', 5, 'Longest wait 18 min')}
      ${row('box-seam', 'Low stock', 2, 'Egg, Santan', 'danger-solid')}</div></section>`),
];

/* ---------- Queue list ---------- */
const qrow = (no, name, size, wait, o = {}) => `<div class="card${o.called ? ' border-primary' : ''}"><div class="card-body d-flex flex-column gap-2 p-3">
  <div class="d-flex align-items-center gap-3"><div class="fs-3 fw-bold lh-1">${no}</div><div class="flex-grow-1"><div class="fw-medium">${name} · ${size} ${size === 1 ? 'person' : 'people'}</div><div class="small text-body-secondary">${wait}</div></div>${o.called ? badge('Called', 'solid') : badge('Waiting', 'wait')}</div>
  <div class="d-flex gap-2">${o.called ? btn('No-show', 'outline-secondary', { c: 'flex-fill', dis: o.early }) + btn('Seated', 'primary', { c: 'flex-fill', i: 'check-lg' }) : btn('Call ' + no, 'outline-primary', { c: 'flex-fill', i: 'bell' })}</div>
  ${o.early ? '<div class="small text-body-secondary">No-show can be marked 5 minutes after calling (in 3 min).</div>' : ''}</div></div>`;
const queue = [
  sp('Queue · Several waiting', 'Queue', 'Queue', { note: 'Oldest ticket first. Call makes the customer\'s ticket page flash, sound and vibrate. Then staff mark Seated, or No-show after 5 minutes.' }, `
    <div class="d-flex justify-content-between align-items-center"><div class="fw-medium">5 groups · longest wait 18 min</div>${upd()}</div>
    ${qrow('A019', 'Hafiz', 2, 'Called 2 min ago', { called: 1, early: 1 })}
    ${qrow('A020', 'Farid', 2, 'Waiting 18 min')}
    ${qrow('A021', 'Mei Xin', 5, 'Waiting 14 min')}
    ${qrow('A022', 'Suresh', 3, 'Waiting 9 min')}
    ${qrow('A023', 'Nurul', 4, 'Waiting 4 min')}`),
  sp('Queue · Empty', 'Queue', 'Queue', {}, `
    <div class="d-flex justify-content-between align-items-center"><div class="fw-medium">0 groups</div>${upd()}</div>
    <div class="card">${emp('people', 'No one is waiting', 'New tickets appear here when customers scan the queue QR at the door.')}</div>`),
];

/* ---------- Table grid ---------- */
const t = (no, cls, line, o = {}) => `<a href="#" class="qs-t${cls ? ' ' + cls : ''}${o.call ? ' call' : ''}${o.sel ? ' sel' : ''}"><b>${no}</b><span>${line}</span>${o.call ? `<span class="bell" aria-label="Waiter called">${i('bell-fill')}</span>` : ''}</a>`;
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
    <div class="alert alert-warning d-flex align-items-center gap-2 mb-0" role="alert">${i('bell-fill')}<div class="flex-grow-1"><div class="fw-semibold">T7 is calling a waiter</div><div class="small">1 min ago · Outdoor</div></div>${btn('Done', 'outline-secondary', { sm: 1 })}</div>
    ${legend}${grid(true)}`),
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
  sp('Orders · Insufficient stock', 'Orders', 'Orders', { low: 2, note: 'Confirm failed because a recipe needs more than is in stock. Confirm is disabled and Edit becomes the main action.' }, pending(alert('danger', 'Insufficient stock: Egg', 'This order needs 3 eggs and only 2 are left. Edit the order or reject it.'))),
  sp('Orders · Edit items', 'Orders', 'Orders', { sheet: 1, note: 'Bottom sheet within thumb reach. Saving sends the customer a new total and keeps the order Pending.',
    modal: mod('Edit order #1042 · T3', `${editRow('Nasi Lemak Ayam', 1)}${editRow('Mee Goreng Mamak', 1)}${editRow('Teh Tarik', 3)}${btn('Add a dish', 'outline-primary', { i: 'plus-lg', block: 1 })}${kv('New total', 'RM30.20', 'fs-5 fw-semibold')}`, btn('Cancel', 'outline-secondary') + btn('Save changes', 'primary')) }, pending()),
  sp('Orders · Reject', 'Orders', 'Orders', { sheet: 1, note: 'Rejecting needs a reason, which the customer sees on their order status page. Stops prank and duplicate orders.',
    modal: mod('Reject order #1043 · T9?', `${field('Reason shown to the customer', 'Duplicate order', { sel: 1 })}${field('Note (optional)', 'Add a note', { ph: 1 })}<div class="small text-body-secondary">The order is kept on record as Rejected. No stock is deducted.</div>`, btn('Keep order', 'outline-secondary') + btn('Reject order', 'danger')) }, pending()),
];

/* ---------- Kitchen view ---------- */
const ticket = (tbl, no, time, age, lines, late) => `<article class="qs-ticket${late ? ' late' : ''}"><header><b>${tbl}</b><span>#${no}</span><span class="age">${age}</span></header><ul>${lines}</ul>${btn('Served', 'primary', { i: 'check-lg' })}</article>`;
const kl = (q, name, note) => `<li><b>${q} ×</b>${name}${note ? `<em>${note}</em>` : ''}</li>`;
const kitchen = [
  tb('Kitchen · Confirmed orders', { count: '4 orders waiting', note: 'Only confirmed orders, oldest first from the left. Read from a metre away: 24 px dish lines, 40 px table numbers, one button per ticket. A ticket turns amber after 10 minutes.' }, `
    ${ticket('T5', 1039, '7:18 pm', '11 min', kl(1, 'Nasi Lemak Ayam') + kl(2, 'Mee Goreng Mamak', '1 no egg') + kl(2, 'Teh Tarik'), true)}
    ${ticket('T11', 1040, '7:21 pm', '8 min', kl(3, 'Roti Canai (2 pcs)') + kl(3, 'Milo Ais'))}
    ${ticket('T3', 1042, '7:23 pm', '6 min', kl(2, 'Nasi Lemak Ayam', 'less spicy') + kl(1, 'Mee Goreng Mamak') + kl(3, 'Teh Tarik', '1 kurang manis'))}
    ${ticket('T7', 1044, '7:26 pm', '3 min', kl(1, 'Nasi Goreng Kampung') + kl(1, 'Teh Tarik'))}`),
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
    <div class="d-flex justify-content-between align-items-center"><h2 class="fs-5">R-20261117-0038</h2>${voided ? badge('Voided', 'danger') : badge('Paid', 'brand')}</div>
    <div class="small text-body-secondary">17 Nov 2026, 7:02 pm · Table T6 · Cash · Aina</div>
    <div class="d-flex flex-column gap-1 small">${kv('3 × Nasi Lemak Ayam', 'RM28.50')}${kv('2 × Mee Goreng Mamak', 'RM16.00')}<hr class="my-1">${kv('Subtotal', 'RM44.50')}${kv('Service charge (10%)', 'RM4.45')}${kv('SST (6%)', 'RM2.94')}</div>
    ${kv('Total', `<span class="${voided ? 'text-decoration-line-through text-secondary' : ''}">RM51.89</span>`, 'fs-5 fw-semibold')}</div></div>
  ${voided ? `<div class="alert alert-danger mb-0"><div class="fw-semibold">Voided on 17 Nov 2026, 8:12 pm</div><div class="small">${kv('Requested by', 'Aina (Cashier)')}${kv('Approved by', 'Mei Ling (Owner)')}${kv('Reason', 'Charged to the wrong table')}</div></div><div class="small text-body-secondary">Voided transactions stay in history and reports. Nothing is deleted.</div>` : btn('Void this transaction', 'outline-danger', { block: 1 })}`;
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

/* ---------- Members ---------- */
const member = (name, phone, since) => `<a href="#"><span class="flex-grow-1"><span class="d-block fw-medium">${name}</span><span class="d-block small text-body-secondary">${phone} · member since ${since}</span></span>${i('chevron-right')}</a>`;
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
];
