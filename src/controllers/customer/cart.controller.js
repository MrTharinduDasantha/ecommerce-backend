const Cart = require('../../models/cart.model');

// Customer Cart Controller
class CartController {
  // Get customer cart
  async getCart(req, res) {
    try {
      const cartData = await Cart.findByCustomerId(req.params.customer_id);
      
      if (!cartData) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      res.json(cartData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
    }
  }

  // Add item to cart
  async addToCart(req, res) {
    try {
      const { product_variation_id, qty, rate } = req.body;
      const customer_id = req.params.customer_id;
      
      // Get or create cart
      const cart_id = await Cart.getOrCreate(customer_id);
      
      // Add item to cart
      const cartTotals = await Cart.addItem(cart_id, product_variation_id, rate, qty);
      
      res.status(200).json({ 
        message: 'Item added to cart successfully', 
        cart_id,
        ...cartTotals
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
    }
  }
}

module.exports = new CartController(); 