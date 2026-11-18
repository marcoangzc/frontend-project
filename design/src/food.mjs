// Flat illustrations that stand in for merchant food photos in the mock-ups.
// The real app shows the photo the merchant uploads; these only show where photos sit and how they crop.
// All drawn in a 100 × 100 box; wide frames crop the middle (preserveAspectRatio slice).

let seed = 1;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const r = (a, b) => a + (b - a) * rnd();
const f = (n) => Math.round(n * 10) / 10;

const plate = (bg) => `<rect width="100" height="100" fill="${bg}"/><circle cx="50" cy="52" r="41" fill="#FFFFFF"/><circle cx="50" cy="52" r="34" fill="none" stroke="#EFEAE2" stroke-width="1.2"/>`;
const dots = (n, cx, cy, rad, col, size = 1.2) => {
  let s = '';
  for (let k = 0; k < n; k++) { const a = r(0, Math.PI * 2), d = Math.sqrt(rnd()) * rad; s += `<ellipse cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" rx="${f(size * 1.4)}" ry="${f(size * 0.8)}" transform="rotate(${f(r(0, 180))} ${f(cx + Math.cos(a) * d)} ${f(cy + Math.sin(a) * d)})" fill="${col}"/>`; }
  return s;
};
const egg = (cx, cy, s = 1) => `<path d="M${cx - 10 * s} ${cy} q${3 * s} ${-9 * s} ${11 * s} ${-8 * s} q${9 * s} ${-1 * s} ${9 * s} ${7 * s} q${0} ${8 * s} ${-10 * s} ${8 * s} q${-11 * s} 0 ${-10 * s} ${-7 * s}z" fill="#FFFDF6"/><circle cx="${cx + 1 * s}" cy="${cy - 0.5 * s}" r="${4.6 * s}" fill="#F2B227"/><circle cx="${cx - 0.6 * s}" cy="${cy - 2 * s}" r="${1.3 * s}" fill="#F8D274"/>`;
const cucumber = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="5.2" fill="#5E9A3D"/><circle cx="${cx}" cy="${cy}" r="4.2" fill="#CFE6AE"/><circle cx="${cx}" cy="${cy}" r="1.6" fill="#E9F4D6"/>`;

const DRAW = {
  'nasi-lemak': () => `${plate('#E8D5B5')}<circle cx="50" cy="52" r="32" fill="#3E8A3B"/><path d="M22 60 Q50 30 80 44" stroke="#2F6E2D" stroke-width="1.2" fill="none"/>
    <ellipse cx="44" cy="47" rx="16" ry="13" fill="#FBF8F0"/>${dots(18, 44, 47, 11, '#EEE7D8', 0.9)}
    <path d="M60 30 q10 -2 13 6 q3 8 -6 10 q-9 2 -11 -5 q-2 -7 4 -11z" fill="#B3361C"/>${dots(6, 66, 37, 4, '#8C2510', 0.9)}
    ${egg(66, 61, 0.95)}${cucumber(32, 66)}${cucumber(39, 71)}
    ${dots(9, 54, 72, 5, '#C88A4B', 1.3)}${dots(7, 61, 75, 4, '#B9A27A', 1.1)}
    <path d="M24 42 q-4 -9 5 -12 q9 -2 11 6 l3 4 q1 3 -2 3 l-4 0 q-9 4 -13 -1z" fill="#9A5421"/><path d="M27 37 q2 -4 6 -4" stroke="#C17A35" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  'mee-goreng': () => { let s = plate('#E3CFAE'); for (let k = 0; k < 22; k++) { const x = r(24, 70), y = r(30, 70); s += `<path d="M${f(x)} ${f(y)} q${f(r(4, 9))} ${f(r(-7, 7))} ${f(r(10, 18))} ${f(r(-3, 3))}" stroke="${k % 4 ? '#D88B2D' : '#B9661C'}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`; }
    return s + `<rect x="36" y="40" width="7" height="7" rx="1.2" fill="#E7C27A"/><rect x="56" y="55" width="7" height="7" rx="1.2" fill="#E7C27A"/><rect x="47" y="62" width="6" height="6" rx="1.2" fill="#F2CF6A"/>${dots(10, 50, 50, 20, '#6FA84A', 1.1)}<path d="M72 64 a9 9 0 0 1 -14 8 z" fill="#9CCB4A"/><path d="M71 64.6 a8 8 0 0 1 -11.6 6.8 z" fill="#DCEFB6"/>`; },
  'nasi-goreng': () => `${plate('#E6D2B0')}<circle cx="48" cy="54" r="23" fill="#E19E47"/>${dots(40, 48, 54, 20, '#F0BD6D', 1)}${dots(10, 48, 54, 20, '#C6461F', 1)}${dots(8, 48, 54, 20, '#6FA84A', 1)}${egg(50, 44, 1.05)}${cucumber(76, 50)}${cucumber(72, 60)}`,
  'roti-canai': () => { const roti = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="16" fill="#E4B562"/><path d="M${cx - 9} ${cy - 4} q5 -6 12 -3 M${cx - 10} ${cy + 4} q8 3 16 -3 M${cx - 3} ${cy - 11} q8 2 9 9" stroke="#C18836" stroke-width="1.6" fill="none" stroke-linecap="round"/>${dots(6, cx, cy, 11, '#B9792C', 1.2)}`;
    return `${plate('#D9C29C')}${roti(40, 44)}${roti(48, 62)}<circle cx="72" cy="40" r="11" fill="#FFFFFF" stroke="#E6E1D8"/><circle cx="72" cy="40" r="8.5" fill="#E8BD3E"/>${dots(5, 72, 40, 6, '#C99A23', 1)}<circle cx="73" cy="64" r="11" fill="#FFFFFF" stroke="#E6E1D8"/><circle cx="73" cy="64" r="8.5" fill="#B4502A"/>${dots(4, 73, 64, 5, '#E9C77B', 1.2)}`; },
  'teh-tarik': () => `<rect width="100" height="100" fill="#D4E3DA"/><ellipse cx="50" cy="86" rx="24" ry="6" fill="#FFFFFF"/><path d="M33 22 h34 l-3 60 q0 4 -4 4 h-20 q-4 0 -4 -4z" fill="#C98A47"/><path d="M33 22 h34 l-0.6 11 h-32.8z" fill="#F3E4C6"/>${dots(7, 50, 26, 12, '#E2CDA3', 1.1)}<path d="M38 36 l2 44" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/><path d="M33 22 h34" stroke="#FFFFFF" stroke-width="1.5"/>`,
  'milo-ais': () => `<rect width="100" height="100" fill="#D6E4EE"/><rect x="60" y="6" width="5" height="40" rx="2" fill="#F4F4F4" transform="rotate(12 62 26)"/><path d="M60 8 l3 0 l-1.5 12z" fill="#E4573D" transform="rotate(12 62 26)"/><path d="M31 24 h38 l-4 60 q0 4 -4 4 h-22 q-4 0 -4 -4z" fill="#6B4226"/>
    <rect x="38" y="34" width="11" height="11" rx="2" fill="#EAF3F7" fill-opacity=".55" transform="rotate(18 43 40)"/><rect x="52" y="44" width="10" height="10" rx="2" fill="#EAF3F7" fill-opacity=".5" transform="rotate(-14 57 49)"/><rect x="41" y="56" width="10" height="10" rx="2" fill="#EAF3F7" fill-opacity=".45" transform="rotate(8 46 61)"/>
    <path d="M31 24 h38 l-0.5 6 h-37z" fill="#9A6A43"/>${dots(9, 50, 26, 14, '#4A2C17', 0.9)}<path d="M36 34 l2 48" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>`,
};

const NAMES = { 'nasi-lemak': 'Nasi Lemak Ayam', 'mee-goreng': 'Mee Goreng Mamak', 'nasi-goreng': 'Nasi Goreng Kampung', 'roti-canai': 'Roti Canai', 'teh-tarik': 'Teh Tarik', 'milo-ais': 'Milo Ais' };

export const food = (id, w = 64, h = w, cls = '') => {
  seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 7) * 97;
  return `<svg class="qs-food${cls ? ' ' + cls : ''}" width="${w}" height="${h}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Photo of ${NAMES[id]}">${DRAW[id]().replace(/\s*\n\s*/g, '')}</svg>`;
};
