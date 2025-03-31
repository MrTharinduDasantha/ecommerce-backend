const pool = require('../config/database');

class Cart {
  static async findByCustomerId(customerId) {
    const [cart] = await pool.query('SELECT * FROM Cart WHERE Customer_idCustomer = ?', [customerId]);
    
    if (cart.length === 0) {
      return null;
    }
    
    const [items] = await pool.query(`
      SELECT cp.*, pv.*, p.Description as product_name 
      FROM Cart_has_Product cp
      JOIN Product_Variations pv ON cp.Product_Variations_idProduct_Variations = pv.idProduct_Variations
      JOIN Product p ON pv.Product_idProduct = p.idProduct
      WHERE cp.Cart_idCart = ?
    `, [cart[0].idCart]);
    
    return { 
      cart: cart[0], 
      items 
    };
  }

  static async getOrCreate(customerId) {
    const [cart] = await pool.query('SELECT * FROM Cart WHERE Customer_idCustomer = ?', [customerId]);
    
    if (cart.length === 0) {
      const [newCart] = await pool.query(
        'INSERT INTO Cart (Customer_idCustomer, Total_Items, Total_Amount) VALUES (?, ?, ?)',
        [customerId, 0, 0]
      );
      
      return newCart.insertId;
    }
    
    return cart[0].idCart;
  }

  static async addItem(cartId, productVariationId, rate, qty) {
    const totalAmount = parseFloat(rate) * parseInt(qty);
    
    // Check if item already exists in cart
    const [existingItem] = await pool.query(
      'SELECT * FROM Cart_has_Product WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?',
      [cartId, productVariationId]
    );
    
    if (existingItem.length > 0) {
      // Update existing item
      await pool.query(
        'UPDATE Cart_has_Product SET Qty = ?, Total_Amount = ? WHERE Cart_idCart = ? AND Product_Variations_idProduct_Variations = ?',
        [qty, totalAmount, cartId, productVariationId]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO Cart_has_Product (Cart_idCart, Product_Variations_idProduct_Variations, Rate, Qty, Total_Amount) VALUES (?, ?, ?, ?, ?)',
        [cartId, productVariationId, rate, qty, totalAmount]
      );
    }
    
    return this.updateCartTotals(cartId);
  }

  static async updateCartTotals(cartId) {
    // Get all items in the cart
    const [items] = await pool.query('SELECT * FROM Cart_has_Product WHERE Cart_idCart = ?', [cartId]);
    const totalItems = items.length;
    const cartTotal = items.reduce((sum, item) => sum + parseFloat(item.Total_Amount || 0), 0);
    
    // Update cart totals
    await pool.query(
      'UPDATE Cart SET Total_Items = ?, Total_Amount = ? WHERE idCart = ?',
      [totalItems, cartTotal, cartId]
    );
    
    return { totalItems, cartTotal };
  }

  static async clearCart(cartId) {
    await pool.query('DELETE FROM Cart_has_Product WHERE Cart_idCart = ?', [cartId]);
    await pool.query('UPDATE Cart SET Total_Items = 0, Total_Amount = 0 WHERE idCart = ?', [cartId]);
  }
}

module.exports = Cart; 