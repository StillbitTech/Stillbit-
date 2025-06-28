// numberUtils.js
// Handy numeric + address helpers for Stillbit dashboard.

/**
 * Compact human-readable format:
 *   1 234      -> "1.23K"
 *   5 678 901  -> "5.68M"
 *   1.2e9      -> "1.20B"
 * Keeps up to 2 decimals, trims trailing zeros.
 */
export function formatNumber(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const fmt = (v, suffix, digits = 2) =>
    sign + parseFloat(v.toFixed(digits)).toString() + suffix;

  if (abs >= 1e9) return fmt(abs / 1e9, "B");
  if (abs >= 1e6) return fmt(abs / 1e6, "M");
  if (abs >= 1e3) return fmt(abs / 1e3, "K", 1);
  if (abs >= 1) return sign + abs.toLocaleString();
  return sign + abs.toPrecision(2); // small numbers
}

/**
 * Validate a Solana-style base58 address (44-chars typical).
 */
export function isValidAddress(addr) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

/**
 * Clamp a number between min and max.
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Debounce a high-frequency function.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
