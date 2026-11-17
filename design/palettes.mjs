// Palette comparison page: the same key screens, switchable between colour palettes, icon styles and fonts.
//   node design/palettes.mjs [body-only-out.html] -> design/palettes.html
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import customer from './src/customer.mjs';
import staff from './src/staff.mjs';
import owner from './src/owner.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), 'utf8');
const b64 = (p) => readFileSync(join(here, p)).toString('base64');

const PICK = ['customer-menu', 'my-ticket', 'cart-status', 'home', 'table-grid', 'orders', 'inventory'];
const sections = [...customer, ...staff, ...owner].filter((s) => PICK.includes(s.id)).sort((a, b) => PICK.indexOf(a.id) - PICK.indexOf(b.id));

const PALS = [
  { id: 'pandan', name: '现在：班兰绿', fill: '#1F5E4B', tint: '#1F5E4B', soft: '#EEF6F1', ratio: '7.6', note: '沉稳、像传统餐馆；不够有活力' },
  { id: 'blue', name: 'iOS 系统蓝', fill: '#0062E6', tint: '#007AFF', soft: '#EAF3FF', ratio: '5.4', note: '最像苹果；和红、黄、绿状态色都不撞色，状态最好分辨' },
  { id: 'teal', name: 'iOS 青色', fill: '#0071A4', tint: '#30B0C7', soft: '#E5F6F9', ratio: '5.4', note: '清新；和你选的“叫号亮青色”是同一家族，整体最统一' },
  { id: 'green', name: 'iOS 绿色', fill: '#1A7F3C', tint: '#34C759', soft: '#E8F8EC', ratio: '5.1', note: '保留“绿色”品牌但更鲜亮；缺点是和“成功/已付款”状态同色' },
];

const css = `
[data-pal="blue"] .dev { --p50:#EAF3FF; --p75:#E3EEFF; --p100:#D6E7FF; --p200:#A8CCFF; --p300:#9BBDEB; --p600:#0062E6; --p700:#0051C2; --p900:#002E6E; --p600-rgb:0,98,230; }
[data-pal="teal"] .dev { --p50:#E5F6F9; --p75:#DCF1F5; --p100:#CBEBF1; --p200:#93D4E0; --p300:#93BFCB; --p600:#0071A4; --p700:#005C86; --p900:#00344D; --p600-rgb:0,113,164; }
[data-pal="green"] .dev { --p50:#E8F8EC; --p75:#DFF4E5; --p100:#CDEFD6; --p200:#97DBA9; --p300:#9CC3A6; --p600:#1A7F3C; --p700:#146830; --p900:#0B3A1C; --p600-rgb:26,127,60; }
[data-pal]:not([data-pal="pandan"]) .dev { --mist:#F2F2F7; --line:#E5E5EA; --line2:#C7C7CC; --slate:#6E6E73; --ink:#1C1C1E; }
[data-font="apple"] .dev { --font: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif; }
[data-font="apple"] .dev h1, [data-font="apple"] .dev .h-page, [data-font="apple"] .dev .qs-big, [data-font="apple"] .dev .qs-qcard2 .no { letter-spacing: -.025em; }
/* Apple Settings style: solid colour squares with white glyphs (decorative, always next to a text label) */
[data-ic="color"] .qs-list > :nth-child(5n+1) .qs-tile:not(.wait):not(.red):not(.gray) { background:#007AFF; color:#fff; }
[data-ic="color"] .qs-list > :nth-child(5n+2) .qs-tile:not(.wait):not(.red):not(.gray) { background:#30B0C7; color:#fff; }
[data-ic="color"] .qs-list > :nth-child(5n+3) .qs-tile:not(.wait):not(.red):not(.gray) { background:#34C759; color:#fff; }
[data-ic="color"] .qs-list > :nth-child(5n+4) .qs-tile:not(.wait):not(.red):not(.gray) { background:#FF9500; color:#fff; }
[data-ic="color"] .qs-list > :nth-child(5n+5) .qs-tile:not(.wait):not(.red):not(.gray) { background:#00C7BE; color:#fff; }
[data-ic="color"] .qs-list .qs-tile.wait { background:#FFCC00; color:#1C1C1E; }
[data-ic="color"] .qs-list .qs-tile.red { background:#FF3B30; color:#fff; }
[data-ic="color"] .qs-list .qs-tile.gray { background:#8E8E93; color:#fff; }
[data-ic="color"] .qs-cat:nth-child(6n+2) .qs-tile { background:#FF9500; color:#fff; }
[data-ic="color"] .qs-cat:nth-child(6n+3) .qs-tile { background:#30B0C7; color:#fff; }
[data-ic="color"] .qs-cat:nth-child(6n+4) .qs-tile { background:#A2845E; color:#fff; }
[data-ic="color"] .qs-cat:nth-child(6n+5) .qs-tile { background:#007AFF; color:#fff; }
[data-ic="color"] .qs-cat:nth-child(6n+6) .qs-tile { background:#FF2D55; color:#fff; }
[data-ic="color"] .qs-dish .qs-tile.tea { background:#FF9500; color:#fff; }
[data-ic="color"] .qs-dish.out .qs-tile { background:#C7C7CC; color:#fff; }
[data-ic="color"] .qs-stat .qs-tile:not(.red):not(.gray) { background:#007AFF; color:#fff; }
[data-ic="color"] .qs-stat .qs-tile.red { background:#FF3B30; color:#fff; }
[data-ic="color"] .qs-stat .qs-tile.gray, [data-ic="color"] .qs-stat:last-child .qs-tile { background:#34C759; color:#fff; }
/* picker */
.pick { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bd-bg); padding-block: 12px; display: flex; flex-direction: column; gap: 10px; border-bottom: 1px solid var(--bd-line); }
.pick-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.pick-row > span { font-size: .875rem; font-weight: 700; color: var(--bd-muted); min-width: 72px; }
.pick button { display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 6px 12px; border-radius: 10px; border: 1px solid var(--bd-line); background: var(--bd-surface); color: var(--bd-fg); font: inherit; font-size: .875rem; font-weight: 600; cursor: pointer; }
.pick button[aria-pressed="true"] { border-color: var(--bd-fg); box-shadow: inset 0 0 0 1px var(--bd-fg); font-weight: 800; }
.pick button:focus-visible { outline: 2px solid var(--bd-accent); outline-offset: 2px; }
.sw { display: inline-flex; } .sw i { width: 16px; height: 16px; border-radius: 5px; margin-right: -4px; box-shadow: 0 0 0 2px var(--bd-surface); }
.pal-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 16px; }
.pal-card { background: var(--bd-surface); border: 1px solid var(--bd-line); border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.pal-card b { font-size: 1rem; color: var(--bd-fg); } .pal-card p { margin: 0; font-size: .875rem; color: var(--bd-muted); }
.pal-card .row { display: flex; gap: 6px; } .pal-card .row i { flex: 1; height: 36px; border-radius: 8px; }
.pal-card .meta { font-size: .8125rem; color: var(--bd-muted); }
`;

const body = `
<div class="board fit" id="board" data-pal="blue" data-ic="soft" data-font="jakarta">
  <header class="board-head">
    <h1>QuickServe colour options</h1>
    <p>同一批画面，切换不同的配色、图标风格和字体来比较。按钮颜色都用苹果“提高对比度”版本，白字可读（对比度 ≥ 4.5:1）；鲜艳的原色只用在图标和浅色底上。状态色不变：琥珀=等待，红=错误和低库存，叫号页=亮青色。</p>
    <div class="pal-cards">${PALS.map((p) => `<div class="pal-card"><b>${p.name}</b><div class="row"><i style="background:${p.fill}"></i><i style="background:${p.tint}"></i><i style="background:${p.soft};box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)"></i></div><p>${p.note}</p><div class="meta">按钮 ${p.fill} · 图标 ${p.tint} · 白字对比度 ${p.ratio}:1</div></div>`).join('')}</div>
  </header>
  <div class="pick">
    <div class="pick-row" role="group" aria-label="配色"><span>配色</span>${PALS.map((p) => `<button type="button" data-k="pal" data-v="${p.id}" aria-pressed="${p.id === 'blue'}"><span class="sw"><i style="background:${p.fill}"></i><i style="background:${p.tint}"></i></span>${p.name.replace('现在：', '')}</button>`).join('')}</div>
    <div class="pick-row" role="group" aria-label="图标"><span>图标</span><button type="button" data-k="ic" data-v="soft" aria-pressed="true">浅色方块（现在）</button><button type="button" data-k="ic" data-v="color" aria-pressed="false">苹果“设置”式彩色方块</button></div>
    <div class="pick-row" role="group" aria-label="字体"><span>字体</span><button type="button" data-k="font" data-v="jakarta" aria-pressed="true">Plus Jakarta Sans（现在）</button><button type="button" data-k="font" data-v="apple" aria-pressed="false">苹果风格：iPhone/Mac 用 SF，其他用 Inter</button></div>
  </div>
  ${sections.map((s) => `
  <section class="screen" id="${s.id}">
    <h3>${s.title}</h3>
    <div class="meta">${s.meta}</div>
    <div class="states" tabindex="0" role="group" aria-label="${s.title} states">
      ${s.frames.map((f) => `<figure class="state state-${f.kind}"><figcaption>${f.name}</figcaption>${f.html}</figure>`).join('\n      ')}
    </div>
  </section>`).join('')}
</div>
<script>
(function(){var b=document.getElementById('board');
function set(k,v){b.setAttribute('data-'+k,v);b.querySelectorAll('.pick [data-k="'+k+'"]').forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-v')===v)});try{localStorage.setItem('qs-'+k,v)}catch(e){}}
b.querySelectorAll('.pick button').forEach(function(x){x.addEventListener('click',function(){set(x.getAttribute('data-k'),x.getAttribute('data-v'))})});
['pal','ic','font'].forEach(function(k){try{var v=localStorage.getItem('qs-'+k);if(v)set(k,v)}catch(e){}});
b.addEventListener('click',function(e){var a=e.target.closest('.dev a[href="#"]');if(a)e.preventDefault()});})();
</script>`;

const icons = read('vendor/bootstrap-icons.min.css').replace(/src:url\([^}]*\}/, `src:url("data:font/woff2;base64,${b64('vendor/bootstrap-icons.woff2')}") format("woff2")}`);
const fonts = `@font-face{font-family:'Plus Jakarta Sans';font-display:swap;font-weight:200 800;src:url("data:font/woff2;base64,${b64('vendor/plus-jakarta-sans-latin-wght-normal.woff2')}") format("woff2")}
@font-face{font-family:'Inter';font-display:swap;font-weight:100 900;src:url("data:font/woff2;base64,${b64('vendor/inter-latin-wght-normal.woff2')}") format("woff2")}`;
const head = `<title>QuickServe Colour Options</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${read('vendor/bootstrap.min.css').replace(/\/\*# sourceMappingURL=.*?\*\//, '')}</style>
<style>${icons}</style>
<style>${fonts}</style>
<style>${read('src/qs.css')}</style>
<style>${css}</style>`;

writeFileSync(join(here, 'palettes.html'), `<!doctype html>\n<html lang="zh">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n${head}\n</head>\n<body>${body}\n</body>\n</html>\n`);
if (process.argv[2]) writeFileSync(process.argv[2], `${head}\n${body}\n`);
console.log(`${sections.length} screens, ${sections.reduce((a, s) => a + s.frames.length, 0)} states, ${PALS.length} palettes`);
