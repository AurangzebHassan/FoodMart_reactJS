const currencySymbols =
{
    USD: "$",

    EUR: "€",
  
    GBP: "£",
  
    PKR: "₨",
  
    JPY: "¥",
  
    INR: "₹",
};



export function formatPrice(price, currencyCode)
{
    const symbol = currencySymbols[currencyCode] || currencyCode; // fallback to code if symbol not found

    return `${symbol}${(Math.round(price * 100) / 100).toFixed(2)}`;
}