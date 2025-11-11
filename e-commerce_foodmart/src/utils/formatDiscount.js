/**
 * Normalize discount tag.
 * - Returns null for empty, "-" or non-numeric/zero inputs.
 * - Always returns "-<number>%" for valid numeric input (supports decimals).
 * - Removes leading zeros by parsing to Number.
 * - Keeps up to 2 decimals, trimming trailing zeros.
 *
 * Examples:
 *  "30"       -> "-30%"
 *  "-30%"     -> "-30%"
 *  "05.5"     -> "-5.5%"
 *  " - 25.750"-> "-25.75%"
 *  "0"        -> null
 *  "-"        -> null
 *  "abc"      -> null
 */
export function formatDiscount(tag) {
  if (tag == null) return null;

  const s = String(tag).trim();

  // reject empty or single dash
  if (s === "" || s === "-" || s === "%" || s === "0") return null;

  // Find first numeric token (allows decimals). Examples found: "05.50", "30", "7.25", "-30.5"
  const match = s.match(/-?\d+(\.\d+)?/); // capture optional leading minus if present
  if (!match) return null;

  // parseFloat removes leading zeros: "05" -> 5
  // Use absolute value so "-30" or "30" both are treated as positive discount amounts
  let num = Math.abs(parseFloat(match[0]));

  // reject zero or NaN
  if (!isFinite(num) || num === 0) return null;

  // Round to 2 decimals (you can change to Math.floor for truncation)
  num = Math.round(num * 100) / 100;

  // Format: remove unnecessary trailing zeros
  // e.g., 25.00 -> "25", 5.50 -> "5.5", 5.25 -> "5.25"
  const asNumber = Number(num.toFixed(2)); // ensures up to 2 decimals
  const display = asNumber % 1 === 0 ? asNumber.toFixed(0) : String(asNumber);
  
//   const final_string = "-" + display + "%"

      return `-${display}%`;
    
    // return final_string
}
