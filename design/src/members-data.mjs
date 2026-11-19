// One member's data, shared by the cashier and owner screens so balances agree everywhere.
// Rules: 1 point per RM1 paid (rounded down), added after payment. 100 points = RM1.00 (placeholder rate).
export const SITI = { name: 'Siti Aminah', phone: '012-345 6789', email: 'siti.aminah@example.com', since: '14 Mar 2026', balance: '1,240' };

// newest first; "after" is the balance after that line
export const HISTORY = [
  { date: '17 Nov 2026', bill: 'R-20261117-0042', what: 'Earned', pts: '+35', after: '1,240' },
  { date: '10 Nov 2026', bill: 'R-20261110-0031', what: 'Earned', pts: '+42', after: '1,205' },
  { date: '5 Nov 2026', bill: '', what: 'Adjusted by Mei Ling: points missed on R-20261020-0008', pts: '+100', after: '1,163' },
  { date: '3 Nov 2026', bill: 'R-20261103-0012', what: 'Earned', pts: '+28', after: '1,063' },
  { date: '3 Nov 2026', bill: 'R-20261103-0012', what: 'Redeemed, RM5.00 off', pts: '−500', after: '1,035' },
  { date: '20 Oct 2026', bill: 'R-20261020-0008', what: 'Earned', pts: '+64', after: '1,535' },
];
