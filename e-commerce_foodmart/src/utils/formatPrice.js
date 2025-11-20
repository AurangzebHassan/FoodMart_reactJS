// const currencySymbols =
// {
//     USD: "$",

//     EUR: "€",
  
//     GBP: "£",
  
//     PKR: "₨",
  
//     JPY: "¥",
  
//     INR: "₹",
// };



// export function formatPrice(price, currencyCode)
// {
//     const symbol = currencySymbols[currencyCode] || currencyCode; // fallback to code if symbol not found

//     return `${symbol}${(Math.round(price * 100) / 100).toFixed(2)}`;
// }



const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PKR: "₨",
  JPY: "¥",
  INR: "₹",
};

export function formatPrice(price, currencyCode = "USD", discount_tag = "-0%") {
  const symbol = currencySymbols[currencyCode] || currencyCode;

  // SAFETY: normalize discount_tag so null / undefined never crash
  const safeTag = typeof discount_tag === "string" ? discount_tag : "-0%";

  // Extract the number
  const match = safeTag.match(/-?\d+(\.\d+)?/);
  const discount_value = match ? parseFloat(match[0]) : 0;

  // Calculate
  const discountedPrice = price - (price * discount_value) / 100;

  return `${symbol}${discountedPrice.toFixed(2)}`;
}
