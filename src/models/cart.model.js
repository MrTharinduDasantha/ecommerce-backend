const pool = require("../config/database");

// ------------------------
// Cart Related Functions
// ------------------------

// Create a new cart for a customer
async function createCart(customerId) {
  const query = `
    INSERT INTO Cart (Customer_idCustomer, Total_Items, Total_Amount)
    VALUES (?, 0, 0.00)
  `;

  const [result] = await pool.query(query, [customerId]);
  return result.insertId;
}

// Get cart by customer id
async function getCartByCustomerId(customerId) {
  const query = `
    SELECT * FROM Cart WHERE Customer_idCustomer = ?
  `;

  const [rows] = await pool.query(query, [customerId]);
  if (rows.length === 0) return null;

  const cart = rows[0];

  // Get cart items with product details
  const [cartItems] = await pool.query(
    `
      SELECT
        cp.Cart_idCart,
        cp.Product_Variations_idProduct_Variations,
        cp.Rate AS CartRate,
        cp.Market_Rate AS MarketPrice,
        cp.Qty AS CartQty,
        cp.Total_Amount,
        cp.Discount_Percentage,
        cp.Discount_Amount,
        cp.NetAmount,
        cp.Discounts_idDiscounts,
        pv.idProduct_Variations,
        pv.Product_idProduct,
        pv.Colour,
        pv.Size,
        pv.SIH,
        pv.Qty AS AvailableQty,
        p.Description AS ProductName,
        p.Main_Image_Url AS ProductImage,
        d.Discount_Value,
        d.Discount_Type AS DiscountType
      FROM Cart_has_Product cp
      JOIN Product_Variations pv ON 
        cp.Product_Variations_idProduct_Variations = pv.idProduct_Variations
      JOIN Product p ON pv.Product_idProduct = p.idProduct
      LEFT JOIN Discounts d ON cp.Discounts_idDiscounts = d.idDiscounts
      WHERE cp.Cart_idCart = ?
    `,
    [cart.idCart]
  );

  cart.items = cartItems;

  return cart;
}

// Add product to cart
async function addProductToCart(
  cartId,
  productVariationId,
  qty,
  rate,
  mktRate
) {
  // Check if product variation exists in cart
  const [existingItem] = await pool.query(
    `
      SELECT * FROM Cart_has_Product
      WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?
    `,
    [cartId, productVariationId]
  );

  // Get product variation details to calculate amount
  const [productVariation] = await pool.query(
    `
      SELECT * FROM Product_Variations WHERE idProduct_Variations = ?
    `,
    [productVariationId]
  );

  if (productVariation.length === 0) {
    throw new Error("Product variation not found");
  }

  // Get product details to check for discounts
  const [product] = await pool.query(
    `
      SELECT * FROM Product WHERE idProduct = ?
    `,
    [productVariation[0].Product_idProduct]
  );

  // Check for active normal discounts
  const [discounts] = await pool.query(
    `
      SELECT * FROM Discounts 
      WHERE Product_idProduct = ? 
      AND Status = 'active' 
      AND (Start_Date <= CURRENT_DATE() AND End_Date >= CURRENT_DATE())
    `,
    [product[0].idProduct]
  );

  // Check for active event discounts
  const [eventDiscounts] = await pool.query(
    `
      SELECT ed.*
      FROM Event_Discounts ed
      JOIN Event_has_Product ehp ON ed.Event_idEvent = ehp.Event_idEvent
      WHERE ehp.Product_idProduct = ?
        AND ed.Status = 'active'
        AND CURDATE() BETWEEN STR_TO_DATE(ed.Start_Date, '%Y-%m-%d') AND STR_TO_DATE(ed.End_Date, '%Y-%m-%d')
    `,
    [product[0].idProduct]
  );

  let discountId = null;
  let discountPercentage = 0;
  let discountAmount = 0;
  let totalDiscountAmount = 0;

  // Calculate normal discount amount if applicable
  if (discounts.length > 0) {
    discountId = discounts[0].idDiscounts;
    if (discounts[0].Discount_Type === "percentage") {
      discountPercentage = discounts[0].Discount_Value;
      discountAmount = (rate * qty * discountPercentage) / 100;
    } else {
      discountAmount = discounts[0].Discount_Value * qty;
    }
    totalDiscountAmount += discountAmount;
  }

  // Calculate event discount amount if applicable
  if (eventDiscounts.length > 0) {
    for (const eventDiscount of eventDiscounts) {
      // Check if this product is included in the event discount
      const productIds = JSON.parse(eventDiscount.Product_Ids || "[]");
      if (productIds.includes(product[0].idProduct)) {
        let eventDiscountAmount = 0;
        if (eventDiscount.Discount_Type === "percentage") {
          eventDiscountAmount = (rate * qty * eventDiscount.Discount_Value) / 100;
        } else {
          eventDiscountAmount = eventDiscount.Discount_Value * qty;
        }
        totalDiscountAmount += eventDiscountAmount;
      }
    }
  }

  // Use total discount amount for calculations
  discountAmount = totalDiscountAmount;

  const totalAmount = rate * qty;
  const netAmount = totalAmount - discountAmount;

  if (existingItem.length > 0) {
    // Update existing cart item
    const query = `
      UPDATE Cart_has_Product
      SET Qty = ?, Market_Rate = ?, Rate = ?, Total_Amount = ?, Discount_Percentage = ?, Discount_Amount = ?, NetAmount = ?, Discounts_idDiscounts = ?
      WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?
    `;
    await pool.query(query, [
      qty,
      mktRate,
      rate,
      totalAmount,
      discountPercentage,
      discountAmount,
      netAmount,
      discountId,
      cartId,
      productVariationId,
    ]);
  } else {
    // Add new cart item
    const query = `
      INSERT INTO Cart_has_Product(
        Cart_idCart, 
        Product_Variations_idProduct_Variations, 
        Market_Rate,
        Rate, 
        Qty, 
        Total_Amount, 
        Discount_Percentage, 
        Discount_Amount, 
        NetAmount, 
        Discounts_idDiscounts
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      cartId,
      productVariationId,
      mktRate,
      rate,
      qty,
      totalAmount,
      discountPercentage,
      discountAmount,
      netAmount,
      discountId,
    ]);
  }

  // Commenting out the problematic UPDATE Product_Variations query
  /*
  await pool.query(
    `
    UPDATE Product_Variations
    SET Qty = Qty - ?, SIH = SIH - ?
    WHERE idProduct_Variations = ?
  `,
    [qty, qty, productVariationId]
  );
  */

  // Update cart totals
  await updateCartTotals(cartId);

  return { success: true };
}

// Update product quantity in cart
async function updateCartItemQuantity(cartId, productVariationId, qty) {
  // Get current cart item
  const [cartItem] = await pool.query(
    `
      SELECT * FROM Cart_has_Product
      WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?
    `,
    [cartId, productVariationId]
  );

  if (cartItem.length === 0) {
    throw new Error("Cart item not found");
  }

  // Save the old quantity from the cart item
  const oldQty = cartItem[0].Qty;

  const rate = cartItem[0].Rate;
  const totalAmount = rate * qty;
  let discountAmount = 0;
  let discountPercentage = 0;

  // Get product ID for this variation
  const [productVariation] = await pool.query(
    `SELECT Product_idProduct FROM Product_Variations WHERE idProduct_Variations = ?`,
    [productVariationId]
  );

  let totalDiscountAmount = 0;

  // Recalculate normal discount if applicable
  if (cartItem[0].Discounts_idDiscounts) {
    const [discount] = await pool.query(
      `SELECT * FROM Discounts WHERE idDiscounts = ?`,
      [cartItem[0].Discounts_idDiscounts]
    );

    if (discount.length > 0) {
      if (discount[0].Discount_Type === "percentage") {
        discountPercentage = discount[0].Discount_Value;
        totalDiscountAmount = (totalAmount * discountPercentage) / 100;
      } else {
        totalDiscountAmount = discount[0].Discount_Value * qty;
      }
    }
  }

  // Recalculate event discounts
  if (productVariation.length > 0) {
    const productId = productVariation[0].Product_idProduct;
    const [eventDiscounts] = await pool.query(
      `
        SELECT ed.*
        FROM Event_Discounts ed
        JOIN Event_has_Product ehp ON ed.Event_idEvent = ehp.Event_idEvent
        WHERE ehp.Product_idProduct = ?
          AND ed.Status = 'active'
          AND CURDATE() BETWEEN STR_TO_DATE(ed.Start_Date, '%Y-%m-%d') AND STR_TO_DATE(ed.End_Date, '%Y-%m-%d')
      `,
      [productId]
    );

    for (const eventDiscount of eventDiscounts) {
      const productIds = JSON.parse(eventDiscount.Product_Ids || "[]");
      if (productIds.includes(productId)) {
        let eventDiscountAmount = 0;
        if (eventDiscount.Discount_Type === "percentage") {
          eventDiscountAmount = (totalAmount * eventDiscount.Discount_Value) / 100;
        } else {
          eventDiscountAmount = eventDiscount.Discount_Value * qty;
        }
        totalDiscountAmount += eventDiscountAmount;
      }
    }
  }

  discountAmount = totalDiscountAmount;

  const netAmount = totalAmount - discountAmount;

  // Update cart item
  const query = `
    UPDATE Cart_has_Product
    SET Qty = ?, Total_Amount = ?, Discount_Amount = ?, NetAmount = ?
    WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?
  `;
  await pool.query(query, [
    qty,
    totalAmount,
    discountAmount,
    netAmount,
    cartId,
    productVariationId,
  ]);

  // Determine the difference between the new quantity and the old quantity
  const qtyDifference = qty - oldQty;

  if (qtyDifference !== 0) {
    await pool.query(
      `
      UPDATE Product_Variations
      SET Qty = Qty - ?, SIH = SIH - ?
      WHERE idProduct_Variations = ?
    `,
      [qtyDifference, qtyDifference, productVariationId]
    );
  }

  // Update cart totals
  await updateCartTotals(cartId);

  return { success: true };
}

// Remove product from cart
async function removeProductFromCart(cartId, productVariationId) {
  const query = `
    DELETE FROM Cart_has_Product
    WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?
  `;
  await pool.query(query, [cartId, productVariationId]);

  // Update cart totals
  await updateCartTotals(cartId);

  return { success: true };
}

// Cleart cart
async function clearCart(cartId) {
  const query = `
    DELETE FROM Cart_has_Product
    WHERE Cart_idCart = ?
  `;
  await pool.query(query, [cartId]);

  // Update cart totals
  await updateCartTotals(cartId);

  return { success: true };
}

// Update cart totals
async function updateCartTotals(cartId) {
  // Calculate total items and total amount
  const [result] = await pool.query(
    `
      SELECT SUM(Qty) as TotalItems, SUM(NetAmount) as TotalAmount
      FROM Cart_has_Product
      WHERE Cart_idCart = ?
    `,
    [cartId]
  );

  const totalItems = result[0].TotalItems || 0;
  const totalAmount = result[0].TotalAmount || 0;

  // Update cart
  const query = `
    UPDATE Cart
    SET Total_Items = ?, Total_Amount = ?
    WHERE idCart = ?
  `;
  await pool.query(query, [totalItems, totalAmount, cartId]);
}

// Add note to cart item
async function addNoteToCartItem(cartId, productVariationId, note) {
  const query = `
    UPDATE Cart_has_Product
    SET Note = ?
    WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?
  `;
  await pool.query(query, [note, cartId, productVariationId]);

  return { success: true };
}

// Convert cart to order
async function convertCartToOrder(
  cartId,
  deliveryAddressId,
  deliveryType,
  paymentType
) {
  // Get cart details
  const [cart] = await pool.query(
    `
      SELECT * FROM Cart WHERE idCart = ?
    `,
    [cartId]
  );

  if (cart.length === 0) {
    throw new Error("Cart not found");
  }

  // Get cart items
  const [cartItems] = await pool.query(
    `
      SELECT * FROM Cart_has_Product WHERE Cart_idCart = ?
    `,
    [cartId]
  );

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate delivery charges based on delivery type
  let deliveryCharges = 0;
  if (deliveryType === "home_delivery") {
    deliveryCharges = 40.0;
  } else if (deliveryType === "express_delivery") {
    deliveryCharges = 70.0;
  } else if (deliveryType === "standard_delivery") {
    deliveryCharges = 30.0;
  } else {
    // Default or error handling for unknown delivery type could be added here
    // For now, proceeding based on potential earlier structure.
  }

  const netAmount = parseFloat(cart[0].Total_Amount) + deliveryCharges;

  // Create order
  const orderInsertQuery = `
    INSERT INTO \`Order\` (
      Date_Time,
      Delivery_Address_idDelivery_Address,
      Total_Amount,
      Delivery_Type,
      Delivery_Charges,
      Net_Amount,
      Payment_Type,
      Payment_Stats,
      Delivery_Status,
      Status
    )
    VALUES (
      NOW(),
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      'pending',
      'processing',
      'active'
    )
  `;

  const [orderResult] = await pool.query(orderInsertQuery, [
    deliveryAddressId,
    cart[0].Total_Amount,
    deliveryType,
    deliveryCharges,
    netAmount,
    paymentType,
  ]);

  const orderId = orderResult.insertId;

  // Add order items
  for (const item of cartItems) {
    const orderItemInsertQuery = `
      INSERT INTO Order_has_Product_Variations (
        Order_idOrder,
        Product_Variations_idProduct_Variations,
        Rate,
        Qty,
        Total, 
        Discount_Percentage,
        Discount_Amount,
        Total_Amount, 
        Note,
        Discounts_idDiscounts
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(orderItemInsertQuery, [
      orderId,
      item.Product_Variations_idProduct_Variations,
      item.Rate,
      item.Qty,
      item.Total_Amount, // Gross total for the item line
      item.Discount_Percentage,
      item.Discount_Amount,
      item.NetAmount, // Net total for the item line (after discount)
      item.Note,
      item.Discounts_idDiscounts,
    ]);
  }

  // Clear cart (this will also update cart totals implicitly if clearCart calls updateCartTotals)
  await clearCart(cartId);

  return { orderId };
}

module.exports = {
  createCart,
  getCartByCustomerId,
  addProductToCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearCart,
  updateCartTotals,
  addNoteToCartItem,
  convertCartToOrder,
};
