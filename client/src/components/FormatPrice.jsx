export const formatPrice = (priceString) => {
  const [currency, value] = priceString.split(" ");
  return `${currency} ${parseFloat(value).toLocaleString("en-US")}`;
};
