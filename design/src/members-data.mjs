// One member's data, shared by the cashier and owner screens so balances agree everywhere.
// Rules: 1 point per RM1 paid (rounded down), added after payment. Points are never cash or a discount:
// they are exchanged for reward dishes, which the owner gives a points cost. Reward dishes earn nothing.
export const SITI = { name: 'Siti Aminah', phone: '012-345 6789', email: 'siti.aminah@example.com', since: '14 Mar 2026', balance: '1,240' };

// Dishes with a points cost (set on the dish by the owner)
export const REWARDS = [
  { name: 'Teh Tarik', cost: 200, img: 'teh-tarik' },
  { name: 'Milo Ais', cost: 250, img: 'milo-ais' },
  { name: 'Roti Canai (2 pcs)', cost: 300, img: 'roti-canai' },
  { name: 'Nasi Lemak Ayam', cost: 1290, img: 'nasi-lemak' },
];

// newest first; "after" is the balance after that line
export const HISTORY = [
  { date: '17 Nov 2026', bill: 'R-20261117-0042', what: 'Earned', pts: '+35', after: '1,240' },
  { date: '10 Nov 2026', bill: 'R-20261110-0031', what: 'Earned', pts: '+42', after: '1,205' },
  { date: '5 Nov 2026', bill: '', what: 'Adjusted by Mei Ling: points missed on R-20261020-0008', pts: '+100', after: '1,163' },
  { date: '3 Nov 2026', bill: 'R-20261103-0012', what: 'Earned', pts: '+28', after: '1,063' },
  { date: '3 Nov 2026', bill: 'Order #0871', what: 'Redeemed: Roti Canai reward', pts: '−300', after: '1,035' },
  { date: '20 Oct 2026', bill: 'R-20261020-0008', what: 'Earned', pts: '+64', after: '1,335' },
];
// after the next visit's redemption (18 Nov): 1,240 − 200 = 1,040
export const REDEEMED = { date: '18 Nov 2026', bill: 'Order #1051', what: 'Redeemed: Teh Tarik reward', pts: '−200', after: '1,040' };
