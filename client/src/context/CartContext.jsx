import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addToCartAPI,
  updateCartItem as updateCartItemAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
} from "../api/cart";
import { useAuth } from "./AuthContext"; // Import the auth context

const CartContext = createContext();

// Helper function to format price
const formatPrice = (price) => `LKR ${Number(price).toFixed(2)}`;

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
  const { user } = useAuth(); // Get the authenticated user

  // Load cart items from API when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        setCartItems([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getCart(user.id);
        if (response.cart && response.cart.items) {
          const mappedItems = response.cart.items.map((item) => ({
            id: item.Product_Variations_idProduct_Variations,
            name: item.Product_Name,
            image: item.ProductImage,
            price: Number(item.NetAmount).toFixed(2),
            quantity: item.Qty,
            color: item.Color,
            size: item.Size,
            colorCode: item.Color_Code,
          }));
          setCartItems(mappedItems);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch cart");
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user?.id]); // Re-fetch when user ID changes

  const addToCart = async (product) => {
    if (!user?.id) {
      throw new Error("User must be logged in to add items to cart");
    }

    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productVariationId: product.id,
        qty: product.quantity || 1,
      };

      const response = await addToCartAPI(data);
      if (response.cart && response.cart.items) {
        console.log(response.cart, "test");
        const mappedItems = response.cart.items.map((item) => ({
          id: item.Product_Variations_idProduct_Variations,
          name: item.ProductName,
          image: item.ProductImage,
          price: Number(item.NetAmount).toFixed(2),
          quantity: item.Qty,
          color: item.Color,
          size: item.Size,
          colorCode: item.Color_Code,
        }));
        setCartItems(mappedItems);
      }
      return response;
    } catch (err) {
      setError(err.message || "Failed to add item to cart");
      console.error("Error adding to cart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.id) {
      throw new Error("User must be logged in to remove items from cart");
    }

    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productVariationId: productId,
      };

      const response = await removeFromCartAPI(data);
      if (response.cart && response.cart.items) {
        const mappedItems = response.cart.items.map((item) => ({
          id: item.Product_Variations_idProduct_Variations,
          name: item.ProductName,
          image: item.ProductImage,
          price: Number(item.Rate),
          quantity: item.Qty,
          color: item.Color,
          size: item.Size,
          colorCode: item.Color_Code,
        }));
        setCartItems(mappedItems);
      }
      return response;
    } catch (err) {
      setError(err.message || "Failed to remove item from cart");
      console.error("Error removing from cart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user?.id) {
      throw new Error("User must be logged in to update cart");
    }

    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productVariationId: productId,
        qty: quantity,
      };

      const response = await updateCartItemAPI(data);
      if (response.cart && response.cart.items) {
        const mappedItems = response.cart.items.map((item) => ({
          id: item.Product_Variations_idProduct_Variations,
          name: item.ProductName,
          image: item.ProductImage,
          price: Number(item.NetAmount).toFixed(2),
          quantity: item.Qty,
          color: item.Color,
          size: item.Size,
          colorCode: item.Color_Code,
        }));
        setCartItems(mappedItems);
      }
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update cart item";
      const availableQty = err.response?.data?.availableQty;
      const message = availableQty
        ? `${errorMessage}. Available quantity: ${availableQty}`
        : errorMessage;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (updatedItem) => {
    if (!user?.id) {
      throw new Error("User must be logged in to update cart");
    }

    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productId: updatedItem.id,
        quantity: updatedItem.quantity,
      };

      const response = await updateCartItemAPI(data);
      setCartItems(response.items || []);
      return response;
    } catch (err) {
      setError(err.message || "Failed to update cart item");
      console.error("Error updating cart item:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.id) {
      throw new Error("User must be logged in to clear cart");
    }

    try {
      setLoading(true);
      const data = { customerId: user.id };
      await clearCartAPI(data);
      setCartItems([]);
    } catch (err) {
      setError(err.message || "Failed to clear cart");
      console.error("Error clearing cart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
    totalPrice,
    formatPrice,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
