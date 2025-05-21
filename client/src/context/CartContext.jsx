import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem as updateCartItemAPI, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI } from '../api/cart';
import { useAuth } from './AuthContext'; // Import the auth context

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
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
        setCartItems(response.items || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch cart');
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user?.id]); // Re-fetch when user ID changes

  const addToCart = async (product) => {
    if (!user?.id) {
      throw new Error('User must be logged in to add items to cart');
    }

    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productId: product.id,
        quantity: 1,
        // Add any other required fields from your API
      };

      const response = await addToCartAPI(data);
      setCartItems(response.items || []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.id) {
      throw new Error('User must be logged in to remove items from cart');
    }

    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productId
      };

      const response = await removeFromCartAPI(data);
      setCartItems(response.items || []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
      console.error('Error removing from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user?.id) {
      throw new Error('User must be logged in to update cart');
    }

    if (newQuantity < 1) return;
    
    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productId,
        quantity: newQuantity
      };

      const response = await updateCartItemAPI(data);
      setCartItems(response.items || []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update cart item');
      console.error('Error updating cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (updatedItem) => {
    if (!user?.id) {
      throw new Error('User must be logged in to update cart');
    }

    try {
      setLoading(true);
      const data = {
        customerId: user.id,
        productId: updatedItem.id,
        quantity: updatedItem.quantity,
        // Add any other fields that need to be updated
      };

      const response = await updateCartItemAPI(data);
      setCartItems(response.items || []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update cart item');
      console.error('Error updating cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.id) {
      throw new Error('User must be logged in to clear cart');
    }

    try {
      setLoading(true);
      const data = { customerId: user.id };
      const response = await clearCartAPI(data);
      setCartItems([]);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 