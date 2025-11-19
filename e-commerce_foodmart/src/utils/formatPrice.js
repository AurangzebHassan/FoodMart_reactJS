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

export function formatPrice(price, currencyCode, discount_tag = "-0%") {
  const symbol = currencySymbols[currencyCode] || currencyCode; // fallback to code if symbol not found

  // Extract numeric part from the discount string
  const match = discount_tag.match(/-?\d+(\.\d+)?/);
  const discount_value = match ? parseFloat(match[0]) : 0;

  // Apply discount
    const discountedPrice = price - (price * discount_value) / 100;


  // Return formatted string
  return `${symbol}${discountedPrice.toFixed(2)}`;
}
