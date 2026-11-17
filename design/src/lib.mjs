// Small HTML helpers for the QuickServe screen board.
// Everything returns plain Bootstrap 5 markup, so a screen can be copied into a React component as-is.

let n = 0;
const id = () => 'f' + (++n);
export const uid = id;

export const i = (name, cls = '') => `<i class="bi bi-${name}${cls ? ' ' + cls : ''}" aria-hidden="true"></i>`;

export const btn = (label, kind = 'primary', o = {}) =>
  `<button type="button" class="btn btn-${kind}${o.lg ? ' btn-lg' : ''}${o.sm ? ' btn-sm' : ''}${o.block ? ' w-100' : ''}${o.c ? ' ' + o.c : ''}"${o.dis ? ' disabled' : ''}>${o.i ? i(o.i, 'me-2') : ''}${label}</button>`;

export const iconBtn = (icon, label, kind = 'outline-secondary') =>
  `<button type="button" class="btn btn-${kind} qs-icon-btn" aria-label="${label}">${i(icon)}</button>`;

// tones: neutral, brand, solid, wait, wait-solid, danger, danger-solid, outline
// Apple Settings style: each meaning has its own system colour. Explicit tones (wait, red, gray, solid, onband) win.
const ICOL = { 'clipboard2-check': 'c-blue', 'journal-text': 'c-blue', 'grid-3x3-gap': 'c-teal', 'table': 'c-teal', 'people': 'c-orange', 'megaphone': 'c-orange', 'box-seam': 'c-brown', 'wallet2': 'c-green',
  'receipt': 'c-blue', 'box-arrow-in-down': 'c-green', 'person-badge-fill': 'c-teal', 'star-fill': 'c-blue', 'egg-fried': 'c-orange', 'basket2-fill': 'c-teal',
  'cookie': 'c-brown', 'cup-hot-fill': 'c-brown', 'cup-straw': 'c-blue', 'cake2-fill': 'c-mint', 'volume-up': 'c-blue', 'phone': 'c-blue', 'bell': 'c-orange', 'info-circle': 'c-blue' };
export const tile = (icon, tone = '', size = '') => {
  const t = (!tone || tone === 'tea') && ICOL[icon] ? ICOL[icon] : tone;
  return `<span class="qs-tile${t ? ' ' + t : ''}${size ? ' ' + size : ''}">${i(icon)}</span>`;
};

export const badge = (label, tone = 'neutral') => `<span class="badge qs-b-${tone}">${label}</span>`;

export const field = (label, value, o = {}) => {
  const d = id();
  const inv = o.err ? ' is-invalid' : '';
  const aria = label ? '' : ` aria-label="${o.aria || value}"`;
  let ctl;
  if (o.sel) ctl = `<select class="form-select${inv}" id="${d}"${aria}><option>${value}</option></select>`;
  else ctl = `<input class="form-control${inv}" id="${d}" type="${o.type || 'text'}"${aria} ${o.ph ? `placeholder="${value}"` : `value="${value}"`}${o.dis ? ' disabled' : ''}>`;
  const fb = o.err ? `<div class="invalid-feedback d-block">${o.err}</div>` : '';
  const help = o.help ? `<div class="form-text">${o.help}</div>` : '';
  const group = o.pre || o.suf
    ? `<div class="input-group${o.err ? ' has-validation' : ''}">${o.pre ? `<span class="input-group-text">${o.pre}</span>` : ''}${ctl}${o.suf ? `<span class="input-group-text">${o.suf}</span>` : ''}</div>${fb}`
    : ctl + fb;
  return `<div class="${o.c || ''}">${label ? `<label class="form-label" for="${d}">${label}</label>` : ''}${group}${help}</div>`;
};

export const check = (label, on, type = 'checkbox', name = '') => {
  const d = id();
  return `<div class="form-check"><input class="form-check-input" type="${type}" id="${d}"${name ? ` name="${name}"` : ''}${on ? ' checked' : ''}><label class="form-check-label" for="${d}">${label}</label></div>`;
};

export const toggle = (label, on) => {
  const d = id();
  return `<div class="form-check form-switch mb-0"><input class="form-check-input" type="checkbox" role="switch" id="${d}" aria-label="${label}"${on ? ' checked' : ''}></div>`;
};

export const kv = (a, b, cls = '') => `<div class="d-flex justify-content-between gap-3${cls ? ' ' + cls : ''}"><span>${a}</span><span class="text-nowrap">${b}</span></div>`;

// tones: danger, warning, primary, secondary
export const alert = (tone, title, text, icon) => {
  const ic = icon || { danger: 'exclamation-triangle-fill', warning: 'clock', primary: 'check-circle-fill', secondary: 'info-circle' }[tone];
  return `<div class="alert alert-${tone} d-flex gap-2 mb-0" role="${tone === 'danger' ? 'alert' : 'status'}"><span class="qs-ai">${i(ic)}</span><div>${title ? `<div class="fw-semibold">${title}</div>` : ''}${text ? `<div class="small">${text}</div>` : ''}</div></div>`;
};

export const upd = (t = 'Updated just now') => `<div class="qs-upd">${i('arrow-repeat')} ${t}</div>`;

export const step = (q) =>
  `<div class="qs-step" role="group" aria-label="Quantity"><button type="button" class="btn btn-link" aria-label="Decrease">${i('dash-lg')}</button><span>${q}</span><button type="button" class="btn btn-link" aria-label="Increase">${i('plus-lg')}</button></div>`;

export const emp = (icon, title, text) =>
  `<div class="qs-emp">${tile(icon, 'gray', 'lg')}<div class="fw-semibold fs-6">${title}</div><div class="small text-secondary">${text}</div></div>`;

// Placeholder QR (random modules with finder patterns). Replace with a real QR library in the build.
export const qr = (size = 160, seed = 7) => {
  const N = 25;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const M = [...Array(N)].map(() => [...Array(N)].map(() => (rnd() > 0.52 ? 1 : 0)));
  const finder = (ox, oy) => {
    for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) {
      const X = ox + x, Y = oy + y;
      if (X < 0 || Y < 0 || X >= N || Y >= N) continue;
      const inside = x >= 0 && x <= 6 && y >= 0 && y <= 6;
      const edge = inside && (x === 0 || x === 6 || y === 0 || y === 6);
      const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      M[Y][X] = edge || core ? 1 : 0;
    }
  };
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  let d = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (M[y][x]) d += `M${x} ${y}h1v1h-1z`;
  return `<svg class="qs-qr" width="${size}" height="${size}" viewBox="-1 -1 ${N + 2} ${N + 2}" role="img" aria-label="QR code"><rect x="-1" y="-1" width="${N + 2}" height="${N + 2}" fill="#fff"/><path d="${d}" fill="#212529"/></svg>`;
};

// heads: 'Name' or {h:'Price', c:'text-end'}; rows: [cells] or {c:[cells], cls:'table-danger'}
export const tbl = (heads, rows) => {
  const hs = heads.map((h) => (typeof h === 'string' ? { h } : h));
  return `<div class="card overflow-hidden"><div class="table-responsive"><table class="table align-middle mb-0 qs-table"><thead><tr>${hs.map((h) => `<th scope="col"${h.c ? ` class="${h.c}"` : ''}>${h.h}</th>`).join('')}</tr></thead><tbody>${rows
    .map((r) => {
      const cells = r.c || r;
      return `<tr${r.cls ? ` class="${r.cls}"` : ''}>${cells.map((c, j) => `<td${hs[j].c ? ` class="${hs[j].c}"` : ''}>${c}</td>`).join('')}</tr>`;
    })
    .join('')}</tbody></table></div></div>`;
};

export const mod = (title, body, foot, w = 480) =>
  `<div class="modal-content qs-modal" style="width:${w}px" role="dialog" aria-label="${title}"><div class="modal-header"><h2 class="modal-title fs-5">${title}</h2><button type="button" class="btn-close" aria-label="Close"></button></div><div class="modal-body d-flex flex-column gap-3">${body}</div>${foot ? `<div class="modal-footer">${foot}</div>` : ''}</div>`;

export const tabs = (labels, active = 0) =>
  `<ul class="nav nav-underline qs-tabs">${labels.map((l, j) => `<li class="nav-item"><a class="nav-link${j === active ? ' active' : ''}" href="#"${j === active ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul>`;

/* ---------- device frames ---------- */

const frame = (kind, name, o, inner) => ({
  kind, name, note: o.note || '',
  html: `<div class="dev dev-${kind}${o.bg ? ' ' + o.bg : ''}">${inner}${o.modal ? `<div class="qs-overlay${o.sheet ? ' qs-sheet' : ''}">${o.modal}</div>` : ''}</div>`,
});

export const url = (u) => `<div class="qs-url"><span>${i('lock')} ${u}</span></div>`;

// Customer phone header: restaurant, table, and the Call waiter button that sits on every table page.
export const chd = (sub = 'Table T3', call = true, extra = '') =>
  `<header class="qs-chd"><div class="flex-grow-1 min-w-0"><div class="qs-chd-k">Restoran Sri Melur</div>${sub ? `<div class="qs-chd-t">${sub}</div>` : ''}${extra ? `<div class="qs-chd-s">${extra}</div>` : ''}</div>${call ? btn('Call waiter', 'outline-secondary', { i: 'bell' }) : ''}</header>`;

// Customer phone screen (no navigation bar, entered by QR)
export const ph = (name, o, body) =>
  frame('ph', name, o, `${url(o.url || 'quickserve.my/t/T3')}${o.head === undefined ? chd() : o.head}<main class="qs-body">${body}</main>${o.bar ? `<div class="qs-bar">${o.bar}</div>` : ''}`);

const TABS = [['Home', 'house-door'], ['Tables', 'grid-3x3-gap'], ['Orders', 'clipboard2-check'], ['Queue', 'people'], ['Pay', 'wallet2']];
const FILL = { 'wallet2': 'wallet-fill' };

// Staff phone screen: app bar, body, optional action bar, bottom tab bar
export const sp = (name, title, tab, o, body) =>
  frame('ph', name, { ...o, bg: 'qs-staff' },
    `<header class="qs-appbar"><button type="button" class="btn qs-appbar-btn" aria-label="Menu">${i('list')}</button><h1>${title}</h1>${o.low ? `<a href="#" class="qs-low">${i('exclamation-triangle-fill')} ${o.low} low</a>` : ''}</header>` +
    `<main class="qs-body">${body}</main>${o.bar ? `<div class="qs-bar">${o.bar}</div>` : ''}` +
    `<nav class="qs-tabbar" aria-label="Front of house">${TABS.map(([l, ic]) => `<a href="#"${l === tab ? ' class="active" aria-current="page"' : ''}><span class="tic">${i(l === tab ? FILL[ic] || ic + '-fill' : ic)}</span><span>${l}</span></a>`).join('')}</nav>`);

const NAV = [['Front of house'], ['Home', 'house-door'], ['Tables', 'grid-3x3-gap'], ['Orders', 'clipboard2-check'], ['Queue', 'people'], ['Payments', 'wallet2'], ['Members', 'person-badge'], ['Kitchen view', 'clock'],
  ['Back office'], ['Menu', 'list'], ['Inventory', 'box-seam'], ['Tables & QR', 'qr-code'], ['Vouchers', 'ticket-perforated'], ['Transactions', 'credit-card'], ['Reports', 'graph-up'], ['Staff', 'person'], ['Settings', 'sliders']];

// Owner PC screen: sidebar split into Front of house / Back office, page header, body
export const pc = (name, act, title, o, body) =>
  frame('pc', name, o,
    `<nav class="qs-side" aria-label="Main"><div class="qs-brand"><span class="qs-logo">Q</span>QuickServe</div>${NAV.map(([l, ic]) =>
      ic ? `<a href="#" class="qs-side-link${l === act ? ' active' : ''}"${l === act ? ' aria-current="page"' : ''}>${i(ic)}<span class="flex-grow-1">${l}</span>${l === 'Inventory' && o.low ? badge(o.low, 'danger-solid') : ''}</a>` : `<div class="qs-side-label">${l}</div>`).join('')}<div class="qs-side-user"><div class="flex-grow-1"><div class="fw-medium">Mei Ling</div><div class="small text-secondary">Owner</div></div>${i('box-arrow-right')}</div></nav>` +
    `<div class="qs-main"><header class="qs-pagehead"><div class="flex-grow-1"><h1>${title}</h1>${o.sub ? `<div class="small text-secondary">${o.sub}</div>` : ''}</div>${o.upd === false ? '' : upd()}${o.act || ''}</header><main class="qs-pcbody">${body}</main></div>`);

// Wall tablet for the kitchen: no navigation, very large type
export const tb = (name, o, body) =>
  frame('tb', name, o, `<header class="qs-kbar"><h1>Kitchen</h1><div>${o.count}</div><div class="ms-auto">${upd()}</div><div class="qs-kclock">${o.time || '7:29 pm'}</div></header><main class="qs-kbody">${body}</main>`);

// Tablet at the counter for the cashier
export const ct = (name, title, o, body) =>
  frame('ct', name, { ...o, bg: 'qs-staff' },
    `<header class="qs-appbar"><button type="button" class="btn qs-appbar-btn" aria-label="Menu">${i('list')}</button><h1>${title}</h1>${o.low ? `<a href="#" class="qs-low">${i('exclamation-triangle-fill')} ${o.low} low</a>` : ''}</header><main class="qs-ctbody">${body}</main>`);

export const section = (sid, title, meta, frames) => ({ id: sid, title, meta, frames });
