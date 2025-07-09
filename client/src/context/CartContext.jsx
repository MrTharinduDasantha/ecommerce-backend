import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem as updateCartItemAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
} from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const mapCartItems = (items) => {
  if (!items) return [];
  
  return items.map((item) => ({
    id: item.Product_Variations_idProduct_Variations,
    productId: item.Product_idProduct,
    name: item.ProductName || item.Product_Name,
    image: item.ProductImage,
    price: Number(item.NetAmount) / Number(item.CartQty), // Use final discounted price per item
    originalPrice: Number(item.CartRate), // Keep original price for reference
    mktPrice: item.MarketPrice,
    quantity: item.CartQty,
    color: item.Color || item.Colour,
    size: item.Size,
    colorCode: item.Color_Code,
    availableQty: item.SIH,
    discountAmount: Number(item.Discount_Amount || 0),
    totalAmount: Number(item.Total_Amount || 0),
    netAmount: Number(item.NetAmount || 0),
  }));
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user?.id) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCart(user.id);
      setCartItems(mapCartItems(response.cart?.items));
    } catch (err) {
      setError(err.message || "Failed to fetch cart");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product) => {
    if (!user?.id) {
      throw new Error("User must be logged in to add items to cart");
    }

    try {
      setLoading(true);
      setError(null);
      const data = {
        customerId: user.id,
        productVariationId: product.id,
        qty: product.quantity || 1,
      };

      const response = await addToCartAPI(data);
      setCartItems(mapCartItems(response.cart?.items));
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to add item to cart";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!user?.id) {
      throw new Error("User must be logged in to update cart");
    }

    if (quantity < 1) return;

    try {
      setLoading(true);
      setError(null);
      const data = {
        customerId: user.id,
        productVariationId: productId,
        qty: quantity,
      };

      const response = await updateCartItemAPI(data);
      setCartItems(mapCartItems(response.cart?.items));
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update cart item";
      const availableQty = err.response?.data?.availableQty;
      const message = availableQty
        ? `${errorMessage}. Available quantity: ${availableQty}`
        : errorMessage;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const removeFromCart = useCallback(async (productId) => {
    if (!user?.id) {
      throw new Error("User must be logged in to remove items from cart");
    }

    try {
      setLoading(true);
      setError(null);
      const data = {
        customerId: user.id,
        productVariationId: productId,
      };

      const response = await removeFromCartAPI(data);
      setCartItems(mapCartItems(response.cart?.items));
      return response;
    } catch (err) {
      setError(err.message || "Failed to remove item from cart");
      console.error("Error removing from cart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const clearCart = useCallback(async () => {
    if (!user?.id) {
      throw new Error("User must be logged in to clear cart");
    }

    try {
      setLoading(true);
      setError(null);
      await clearCartAPI({ customerId: user.id });
      setCartItems([]);
    } catch (err) {
      setError(err.message || "Failed to clear cart");
      console.error("Error clearing cart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const totalPrice = useMemo(() => (
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  ), [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    getTotal: () => totalPrice,
  }), [cartItems, loading, error, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;