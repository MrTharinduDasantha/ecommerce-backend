const Product = require('../../models/product.model');
const pool = require('../../config/database');

// Admin Products Controller
class ProductController {
  // Get all products with pagination
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const products = await Product.findAll(limit, offset);
      const totalProducts = await Product.count();
      
      res.json({
        products,
        pagination: {
          page,
          limit,
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
  }

  // Create a new product
  async createProduct(req, res) {
    try {
      const { 
        description, 
        product_brand_id, 
        market_price, 
        selling_price, 
        main_image_url, 
        long_description, 
        sku 
      } = req.body;
      
      const productId = await Product.create({
        description, 
        product_brand_id, 
        market_price, 
        selling_price, 
        main_image_url, 
        long_description, 
        sku
      });
      
      res.status(201).json({ 
        id: productId, 
        message: 'Product created successfully' 
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
  }

  // Update an existing product
  async updateProduct(req, res) {
    try {
      const { 
        description, 
        product_brand_id, 
        market_price, 
        selling_price, 
        main_image_url, 
        long_description, 
        sku 
      } = req.body;
      
      const affectedRows = await Product.update(req.params.id, {
        description, 
        product_brand_id, 
        market_price, 
        selling_price, 
        main_image_url, 
        long_description, 
        sku
      });
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const affectedRows = await Product.delete(req.params.id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
  }

  // Get product categories
  async getCategories(req, res) {
    try {
      const [categories] = await pool.query('SELECT * FROM Product_Category');
      const [subCategories] = await pool.query('SELECT * FROM Sub_Category');
      
      res.json({
        categories,
        subCategories
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
  }

  // Create product category
  async createCategory(req, res) {
    try {
      const { image_icon_url } = req.body;
      
      const [result] = await pool.query(
        'INSERT INTO Product_Category (Image_Icon_Url) VALUES (?)',
        [image_icon_url]
      );
      
      res.status(201).json({
        id: result.insertId,
        message: 'Category created successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
  }
}

module.exports = new ProductController(); 