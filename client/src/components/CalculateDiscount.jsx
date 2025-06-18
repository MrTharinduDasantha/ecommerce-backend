export const calculateDiscountPercentage = (oldPrice, currentPrice) => {
    if (!oldPrice || !currentPrice) return 0
    const discount =
      ((parseFloat(oldPrice) - parseFloat(currentPrice)) /
        parseFloat(oldPrice)) *
      100
    return Math.round(discount)
  }