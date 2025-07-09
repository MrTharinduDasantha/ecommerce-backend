const Product = require('../../models/product.model');
const pool = require('../../config/database');

// Customer Products Controller
class ProductController {
  // Get all products with full discount information
  async getAllProducts(req, res) {
    try {
      const basicProducts = await Product.getAllProducts();
      
      // Enhance each product with complete discount information
      const enhancedProducts = await Promise.all(
        basicProducts.map(async (product) => {
          // Get complete product details including discounts
          const fullProduct = await Product.getProductById(product.idProduct);
          return fullProduct;
        })
      );
      
      res.status(200).json({ 
        message: 'Products fetched successfully', 
        products: enhancedProducts 
      });
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const product = await Product.getProductById(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Log discount data for debugging
      console.log(`Product ${req.params.id} discounts:`, product.discounts);
      console.log(`Product ${req.params.id} event discounts:`, product.eventDiscounts);
      
      res.status(200).json({ 
        message: 'Product fetched successfully', 
        product 
      });
    } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
  }

  // Test endpoint to check Event_Discounts for a specific product
  async getProductEventDiscounts(req, res) {
    try {
      const productId = req.params.id;
      const eventDiscounts = await Product.getActiveEventDiscountsByProductId(productId);
      
      res.status(200).json({
        message: 'Event discounts fetched successfully',
        productId,
        eventDiscounts,
        count: eventDiscounts.length
      });
    } catch (error) {
      console.error('Error fetching event discounts:', error);
      res.status(500).json({ message: 'Failed to fetch event discounts', error: error.message });
    }
  }

  // Get product FAQs
  async getProductFaqs(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM FAQ WHERE Product_idProduct = ?', [req.params.id]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product FAQs', error: error.message });
    }
  }

  // Add product FAQ
  async addProductFaq(req, res) {
    try {
      const { question, answer } = req.body;
      const productId = req.params.id;
      
      // Verify product exists
      const product = await Product.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const [result] = await pool.query(
        'INSERT INTO FAQ (Question, Answer, Product_idProduct) VALUES (?, ?, ?)',
        [question, answer, productId]
      );
      
      res.status(201).json({ 
        id: result.insertId, 
        message: 'FAQ added successfully' 
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add FAQ', error: error.message });
    }
  }

  // Update product FAQ
  async updateProductFaq(req, res) {
    try {
      const { question, answer } = req.body;
      const productId = req.params.id;
      const faqId = req.params.faqId;
      
      const [result] = await pool.query(
        'UPDATE FAQ SET Question = ?, Answer = ? WHERE idFAQ = ? AND Product_idProduct = ?',
        [question, answer, faqId, productId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'FAQ not found or does not belong to this product' });
      }
      
      res.json({ message: 'FAQ updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update FAQ', error: error.message });
    }
  }

  // Delete product FAQ
  async deleteProductFaq(req, res) {
    try {
      const productId = req.params.id;
      const faqId = req.params.faqId;
      
      const [result] = await pool.query(
        'DELETE FROM FAQ WHERE idFAQ = ? AND Product_idProduct = ?',
        [faqId, productId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'FAQ not found or does not belong to this product' });
      }
      
      res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete FAQ', error: error.message });
    }
  }
}

module.exports = new ProductController(); 