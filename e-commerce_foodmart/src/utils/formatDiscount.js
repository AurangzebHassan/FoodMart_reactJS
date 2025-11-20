/**
 * Normalize discount tag.
 * - Returns null for empty, "-" or non-numeric/zero inputs.
 * - Always returns "-<number>%" for valid numeric input (supports decimals).
 * - Removes leading zeros by parsing to Number.
 * - Keeps up to 2 decimals, trimming trailing zeros.
 *
 * Examples:
 * "30" -> "-30%"
 * "-30%" -> "-30%"
 * "05.5" -> "-5.5%"
 * " - 25.750"-> "-25.75%"
 * "0" -> null
 * "-" -> null
 * "abc" -> null
 */
export function formatDiscount(tag) {
  if (!tag) return null;

  const s = String(tag).trim();
  if (!s || s === "-" || s === "%" || s === "0") return null;

  // Extract first numeric value, always positive for discount calculation
  const match = s.match(/\d+(\.\d+)?/); // Remove optional leading minus
  if (!match) return null;

  let num = parseFloat(match[0]);
  if (!isFinite(num) || num === 0) return null;

  // Round to 2 decimals and trim unnecessary zeros
  num = Math.round(num * 100) / 100;
  const display =
    Number(num.toFixed(2)) % 1 === 0 ? num.toFixed(0) : num.toFixed(2);

  return `-${display}%`;
}