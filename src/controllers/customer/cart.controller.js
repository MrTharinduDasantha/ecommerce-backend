const Cart = require("../../models/cart.model");
const pool = require("../../config/database");

// ------------------------
// Cart Related Functions
// ------------------------

// Get cart for a customer
async function getCart(req, res) {
  try {
    const customerId = req.params.customerId || req.user.customerId;

    // Check if customer exists
    const [customer] = await pool.query(
      "SELECT * FROM Customer WHERE idCustomer = ?",
      [customerId]
    );

    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get or create cart
    let cart = await Cart.getCartByCustomerId(customerId);

    if (!cart) {
      const cartId = await Cart.createCart(customerId);
      cart = {
        idCart: cartId,
        Customer_idCustomer: customerId,
        Total_Items: 0,
        Total_Amount: 0,
        items: [],
      };
    }

    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
}

// Add product to cart
async function addToCart(req, res) {
  try {
    const { customerId, productVariationId, qty } = req.body;

    if (!customerId || !productVariationId || !qty) {
      return res.status(400).json({
        message: "Customer ID, product variation ID, and quantity are required",
      });
    }

    // Check if customer exists
    const [customer] = await pool.query(
      "SELECT * FROM Customer WHERE idCustomer = ?",
      [customerId]
    );

    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if product variation exists
    const [productVariation] = await pool.query(
      "SELECT * FROM Product_Variations WHERE idProduct_Variations = ?",
      [productVariationId]
    );

    if (productVariation.length === 0) {
      return res.status(404).json({ message: "Product variation not found" });
    }

    console.log("Product variation found:", productVariation[0]);

    // Check if qunatity is avaiable
    if (productVariation[0].Qty < qty) {
      return res.status(400).json({
        message: "Requested quantity not available",
        availableQty: productVariation[0].Qty,
      });
    }

    // Get or create cart
    let cart = await Cart.getCartByCustomerId(customerId);
    let cartId;

    if (!cart) {
      cartId = await Cart.createCart(customerId);
      console.log("Created new cart with ID:", cartId);
    } else {
      cartId = cart.idCart;
      console.log("Using existing cart with ID:", cartId);
    }

    // Get product price
    const [product] = await pool.query(
      "SELECT * FROM Product WHERE idProduct = ?",
      [productVariation[0].Product_idProduct]
    );

    console.log("Product found:", product[0]);

    // Use the selling price from the Product table if the Product_Variations rate is 0
    let variationRate = parseFloat(productVariation[0].Rate) || 0;
    const rate = variationRate === 0 ? product[0].Selling_Price : variationRate;

    console.log("Using rate:", rate);

    // Add product to cart
    await Cart.addProductToCart(cartId, productVariationId, qty, rate);

    // Get updated cart
    cart = await Cart.getCartByCustomerId(customerId);

    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
      stack: error.stack,
    });
  }
}

// Update cart item quantity
async function updateCartItem(req, res) {
  try {
    const { customerId, productVariationId, qty } = req.body;

    if (!customerId || !productVariationId || !qty) {
      return res.status(400).json({
        message: "Customer ID, product variation ID, and quantity are required",
      });
    }

    // Get cart
    const cart = await Cart.getCartByCustomerId(customerId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Get current cart item to check existing quantity
    const [cartItem] = await pool.query(
      "SELECT * FROM Cart_has_Product WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?",
      [cart.idCart, productVariationId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Check if product variation exists
    const [productVariation] = await pool.query(
      "SELECT * FROM Product_Variations WHERE idProduct_Variations = ?",
      [productVariationId]
    );

    if (productVariation.length === 0) {
      return res.status(404).json({ message: "Product variation not found" });
    }

    // Calculate the difference between new quantity and current cart quantity
    const currentCartQty = cartItem[0].Qty;
    const qtyDifference = qty - currentCartQty;

    // Check if the new total quantity (including what's already in cart) is available
    if (productVariation[0].Qty < qtyDifference) {
      return res.status(400).json({
        message: "Requested quantity not available",
        availableQty: productVariation[0].Qty + currentCartQty,
      });
    }

    // Update cart item
    await Cart.updateCartItemQuantity(cart.idCart, productVariationId, qty);

    // Get updated cart
    const updatedCart = await Cart.getCartByCustomerId(customerId);

    res
      .status(200)
      .json({ message: "Cart item updated successfully", cart: updatedCart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
}

// Remove product from cart
async function removeFromCart(req, res) {
  try {
    const { customerId, productVariationId } = req.body;

    if (!customerId || !productVariationId) {
      return res
        .status(400)
        .json({ message: "Customer ID and product variation ID are required" });
    }

    // Get cart
    const cart = await Cart.getCartByCustomerId(customerId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove product from cart
    await Cart.removeProductFromCart(cart.idCart, productVariationId);

    // Get updated cart
    const updatedCart = await Cart.getCartByCustomerId(customerId);

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
}

// Clear cart
async function clearCart(req, res) {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Get cart
    const cart = await Cart.getCartByCustomerId(customerId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear cart
    await Cart.clearCart(cart.idCart);

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
}

// Add note to cart item
async function addNoteToCartItem(req, res) {
  try {
    const { customerId, productVariationId, note } = req.body;

    if (!customerId || !productVariationId || !note) {
      return res.status(400).json({
        message: "Customer ID, product variation ID, and note are required",
      });
    }

    // Get cart
    const cart = await Cart.getCartByCustomerId(customerId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Add note to cart item
    await Cart.addNoteToCartItem(cart.idCart, productVariationId, note);

    // Get updated cart
    const updatedCart = await Cart.getCartByCustomerId(customerId);

    res.status(200).json({
      message: "Note added to cart item successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error adding note to cart item:", error);
    res.status(500).json({ message: "Failed to add note to cart item" });
  }
}

// Checkout (It will convert cart to order)
async function checkout(req, res) {
  try {
    const { customerId, deliveryAddressId, deliveryType, paymentType } =
      req.body;

    if (!customerId || !deliveryAddressId || !deliveryType || !paymentType) {
      return res.status(400).json({
        message:
          "Customer ID, delivery address ID, delivery type, and payment type are required",
      });
    }

    // Get cart
    const cart = await Cart.getCartByCustomerId(customerId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check if delivery address exists
    const [deliveryAddress] = await pool.query(
      "SELECT * FROM Delivery_Address WHERE idDelivery_Address = ? AND Customer_idCustomer = ?",
      [deliveryAddressId, customerId]
    );

    if (deliveryAddress.length === 0) {
      return res.status(404).json({ message: "Delivery address not found" });
    }

    // Convert cart to order
    const result = await Cart.convertCartToOrder(
      cart.idCart,
      deliveryAddressId,
      deliveryType,
      paymentType
    );

    res.status(200).json({
      message: "Checkout successful",
      orderId: result.orderId,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Failed to checkout" });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addNoteToCartItem,
  checkout,
};
