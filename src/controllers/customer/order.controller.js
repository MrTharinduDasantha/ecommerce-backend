const Order = require('../../models/order.model');
const Cart = require('../../models/cart.model');

// Customer Order Controller
class OrderController {
  // Get customer orders
  async getCustomerOrders(req, res) {
    try {
      const orders = await Order.findByCustomerId(req.params.customer_id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
  }

  // Create new order
  async createOrder(req, res) {
    try {
      const { customer_id, delivery_address_id, cart_id, delivery_type, payment_type } = req.body;
      
      // Get cart data
      const cartData = await Cart.findByCustomerId(customer_id);
      if (!cartData) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      
      const total_amount = cartData.cart.Total_Amount;
      const delivery_charges = delivery_type === 'express' ? 10 : 5;
      const net_amount = parseFloat(total_amount) + delivery_charges;
      
      // Create order
      const order_id = await Order.create({
        delivery_address_id,
        total_amount,
        delivery_type,
        delivery_charges,
        net_amount,
        payment_type
      });
      
      // Add cart items to order
      for (const item of cartData.items) {
        await Order.addOrderItem({
          order_id,
          product_variation_id: item.Product_Variations_idProduct_Variations,
          rate: item.Rate,
          qty: item.Qty,
          total: item.Total_Amount,
          discount_percentage: item.Discount_Percentage || 0,
          discount_amount: item.Discount_Amount || 0,
          total_amount: item.Total_Amount
        });
      }
      
      // Clear cart
      await Cart.clearCart(cart_id);
      
      res.status(201).json({ order_id, message: 'Order created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
  }
}

module.exports = new OrderController(); 