// Builds the QuickServe screen board into one self-contained HTML file.
//   node design/build.mjs            -> design/index.html
//   node design/build.mjs <out.html> -> also writes a body-only copy (no doctype) to <out.html>
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import customer from './src/customer.mjs';
import staff from './src/staff.mjs';
import owner from './src/owner.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), 'utf8');

const bootstrap = read('vendor/bootstrap.min.css').replace(/\/\*# sourceMappingURL=.*?\*\//, '');
const woff2 = readFileSync(join(here, 'vendor/bootstrap-icons.woff2')).toString('base64');
const icons = read('vendor/bootstrap-icons.min.css').replace(/src:url\([^}]*\}/, `src:url("data:font/woff2;base64,${woff2}") format("woff2")}`);
const theme = read('src/qs.css');

const roles = [
  { id: 'customer', title: 'Customer', sub: 'No login. Each QR code opens one short flow on the customer\'s own phone (360 px).', sections: customer },
  { id: 'staff', title: 'Cashier, waiter and kitchen', sub: 'Cashier role on a phone or counter tablet; the kitchen tablet uses a staff login and shows only the kitchen view.', sections: staff },
  { id: 'owner', title: 'Owner back office', sub: 'Owner role on a PC (1280 px). The owner can also open every front-of-house page.', sections: owner },
];

const count = roles.reduce((a, r) => a + r.sections.reduce((b, s) => b + s.frames.length, 0), 0);

const body = `
<div class="board fit" id="board">
  <header class="board-head">
    <h1>QuickServe UI screens</h1>
    <p>${roles.reduce((a, r) => a + r.sections.length, 0)} screens and ${count} states for the browser-based POS, drawn in Bootstrap 5 with Bootstrap Icons so each one can be built as shown. The grey note under a frame says what triggers that state.</p>
    <div class="board-tools">
      <div class="zoom" role="group" aria-label="Tablet and PC frame size"><span>Tablet and PC frames</span><button type="button" id="z-fit" aria-pressed="true">60%</button><button type="button" id="z-full" aria-pressed="false">100%</button></div>
    </div>
  </header>
  ${roles.map((r) => `
  <section class="role" id="${r.id}">
    <h2>${r.title}</h2>
    <p>${r.sub}</p>
    <ul class="board-toc">${r.sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join('')}</ul>
    ${r.sections.map((s) => `
    <section class="screen" id="${s.id}">
      <h3>${s.title}</h3>
      <div class="meta">${s.meta}</div>
      <div class="states" tabindex="0" role="group" aria-label="${s.title} states">
        ${s.frames.map((f) => `<figure class="state state-${f.kind}"><figcaption>${f.name}</figcaption>${f.html}${f.note ? `<p class="note">${f.note}</p>` : ''}</figure>`).join('\n        ')}
      </div>
    </section>`).join('')}
  </section>`).join('')}
</div>
<script>
(function(){
  var b=document.getElementById('board'),f=document.getElementById('z-fit'),u=document.getElementById('z-full');
  function set(fit){b.classList.toggle('fit',fit);f.setAttribute('aria-pressed',fit);u.setAttribute('aria-pressed',!fit);try{localStorage.setItem('qs-zoom',fit?'fit':'full')}catch(e){}}
  f.addEventListener('click',function(){set(true)});u.addEventListener('click',function(){set(false)});
  try{if(localStorage.getItem('qs-zoom')==='full')set(false)}catch(e){}
  // Mock links and buttons do nothing; stop "#" links from jumping to the top of the board.
  b.addEventListener('click',function(e){var a=e.target.closest('.dev a[href="#"]');if(a)e.preventDefault()});
})();
</script>`;

const head = `<title>QuickServe UI Screens</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${bootstrap}</style>
<style>${icons}</style>
<style>${theme}</style>`;

writeFileSync(join(here, 'index.html'), `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n${head}\n</head>\n<body>${body}\n</body>\n</html>\n`);
if (process.argv[2]) writeFileSync(process.argv[2], `${head}\n${body}\n`);
console.log(`${roles.map((r) => `${r.title}: ${r.sections.length} screens`).join(' | ')} | ${count} states`);
