import { formatDiscount } from "./formatDiscount";


const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PKR: "₨",
  JPY: "¥",
  INR: "₹",
};

/**
 * Format a price with optional discount.
 * - price: number
 * - currencyCode: string (USD, EUR, etc.)
 * - discountTag: optional discount string like '-10%'
 *
 * Returns a string like "$18.00" or "€15.50" after applying discount.
 */
export function formatPrice(price, currencyCode = "USD", discountTag = null) {
  const symbol = currencySymbols[currencyCode] || currencyCode;
  let numericPrice = Number(price);
  if (isNaN(numericPrice)) numericPrice = 0;

  // Apply discount if valid
  if (discountTag) {
    const safeDiscount = formatDiscount(discountTag); // Use normalized discount
    if (safeDiscount) {
      const match = safeDiscount.match(/\d+(\.\d+)?/);
      const discountValue = match ? parseFloat(match[0]) : 0;
      if (discountValue) {
        numericPrice = +(numericPrice * (1 - discountValue / 100)).toFixed(2); // ALWAYS reduce the price
      }
    }
  }

  return `${symbol}${numericPrice.toFixed(2)}`;
}