export const calculateDiscountPercentage = (oldPrice, currentPrice) => {
    if (!oldPrice || !currentPrice) return 0
    const discount =
      ((parseFloat(oldPrice) - parseFloat(currentPrice)) /
        parseFloat(oldPrice)) *
      100
    return Math.round(discount)
  }

// Calculate discounted price based on discount type and value
export const calculateDiscountedPrice = (originalPrice, discount) => {
  if (!discount || !discount.Discount_Type || !discount.Discount_Value) {
    return originalPrice;
  }
  
  const price = parseFloat(originalPrice);
  const discountValue = parseFloat(discount.Discount_Value);
  
  if (discount.Discount_Type === "percentage") {
    return price - (price * discountValue) / 100;
  } else if (discount.Discount_Type === "fixed") {
    return Math.max(0, price - discountValue);
  }
  
  return price;
};

// Calculate discount amount based on discount type and value
export const calculateDiscountAmount = (originalPrice, discount) => {
  if (!discount || !discount.Discount_Type || !discount.Discount_Value) {
    return 0;
  }
  
  const price = parseFloat(originalPrice);
  const discountValue = parseFloat(discount.Discount_Value);
  
  if (discount.Discount_Type === "percentage") {
    return (price * discountValue) / 100;
  } else if (discount.Discount_Type === "fixed") {
    return Math.min(price, discountValue); // Can't discount more than the price
  }
  
  return 0;
};

// Calculate total discount from all applicable discounts (normal + event discounts)
export const calculateTotalDiscount = (product) => {
  if (!product) return { totalAmount: 0, totalPercentage: 0, discounts: [] };
  
  const originalPrice = parseFloat(product.Selling_Price || product.price || 0);
  const marketPrice = parseFloat(product.Market_Price || product.oldPrice || originalPrice);
  
  let totalDiscountAmount = 0;
  const appliedDiscounts = [];
  
  // Calculate normal product discounts
  if (product.discounts && product.discounts.length > 0) {
    product.discounts.forEach(discount => {
      if (discount.Status === 'active') {
        const discountAmount = calculateDiscountAmount(originalPrice, discount);
        totalDiscountAmount += discountAmount;
        appliedDiscounts.push({
          type: 'product',
          description: discount.Description,
          discountType: discount.Discount_Type,
          discountValue: discount.Discount_Value,
          amount: discountAmount
        });
      }
    });
  }
  
  // Calculate event discounts
  if (product.eventDiscounts && product.eventDiscounts.length > 0) {
    product.eventDiscounts.forEach(eventDiscount => {
      if (eventDiscount.status === 'active') {
        // Check if this product is included in the event discount
        const productId = parseInt(product.idProduct || product.id);
        if (eventDiscount.productIds && eventDiscount.productIds.includes(productId)) {
          const discountAmount = calculateDiscountAmount(originalPrice, {
            Discount_Type: eventDiscount.discountType,
            Discount_Value: eventDiscount.discountValue
          });
          totalDiscountAmount += discountAmount;
          appliedDiscounts.push({
            type: 'event',
            description: eventDiscount.description,
            discountType: eventDiscount.discountType,
            discountValue: eventDiscount.discountValue,
            amount: discountAmount
          });
        }
      }
    });
  }
  
  // Calculate market price discount (difference between market price and selling price)
  let marketDiscountAmount = 0;
  if (marketPrice > originalPrice) {
    marketDiscountAmount = marketPrice - originalPrice;
  }
  
  // Total discount includes both active discounts and market price difference
  const finalTotalDiscount = totalDiscountAmount + marketDiscountAmount;
  const finalPrice = Math.max(0, originalPrice - totalDiscountAmount);
  
  // Calculate total percentage based on the highest reference price
  const referencePrice = Math.max(marketPrice, originalPrice);
  const totalPercentage = referencePrice > 0 ? (finalTotalDiscount / referencePrice) * 100 : 0;
  
  return {
    originalPrice,
    marketPrice,
    finalPrice,
    totalAmount: finalTotalDiscount,
    activeDiscountAmount: totalDiscountAmount,
    marketDiscountAmount,
    totalPercentage: Math.round(totalPercentage),
    discounts: appliedDiscounts,
    hasDiscounts: appliedDiscounts.length > 0 || marketDiscountAmount > 0
  };
};

// Get the best discount label for display
export const getBestDiscountLabel = (product) => {
  const discountInfo = calculateTotalDiscount(product);
  
  if (!discountInfo.hasDiscounts) return null;
  
  return `${discountInfo.totalPercentage}% OFF`;
};

// Calculate final display price after all discounts
export const getFinalPrice = (product) => {
  const discountInfo = calculateTotalDiscount(product);
  return discountInfo.finalPrice;
};