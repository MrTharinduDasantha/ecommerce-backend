export const formatPrice = (priceInput) => {
  // If it's already a formatted string with currency (like "KSh 1500")
  if (typeof priceInput === 'string' && priceInput.includes(' ')) {
    const [currency, value] = priceInput.split(" ");
    const numericValue = parseFloat(value);
    const formattedValue = numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${currency} ${formattedValue}`;
  }
  
  // If it's a number or numeric string without currency
  const numericValue = typeof priceInput === 'string' 
    ? parseFloat(priceInput.replace(/[^\d.-]/g, '')) 
    : Number(priceInput);
  
  const formattedValue = numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Default to KSh if no currency provided
  return `LKR ${formattedValue}`;
};