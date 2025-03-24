const pool = require('../config/database');

class Product {
  static async findAll(limit, offset) {
    const [rows] = await pool.query(
      'SELECT p.*, pb.Brand_Name FROM Product p ' +
      'LEFT JOIN Product_Brand pb ON p.Product_Brand_idProduct_Brand = pb.idProduct_Brand ' +
      'ORDER BY p.idProduct DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async findAllWithoutPagination() {
    const [rows] = await pool.query('SELECT * FROM Product');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Product WHERE idProduct = ?', [id]);
    return rows.length ? rows[0] : null;
  }

  static async create(productData) {
    const { 
      description, 
      product_brand_id, 
      market_price, 
      selling_price, 
      main_image_url, 
      long_description, 
      sku 
    } = productData;
    
    const [result] = await pool.query(
      'INSERT INTO Product (Description, Product_Brand_idProduct_Brand, Market_Price, Selling_Price, Main_Image_Url, Long_Description, SKU) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [description, product_brand_id, market_price, selling_price, main_image_url, long_description, sku]
    );
    
    return result.insertId;
  }

  static async update(id, productData) {
    const { 
      description, 
      product_brand_id, 
      market_price, 
      selling_price, 
      main_image_url, 
      long_description, 
      sku 
    } = productData;
    
    const [result] = await pool.query(
      'UPDATE Product SET Description = ?, Product_Brand_idProduct_Brand = ?, Market_Price = ?, Selling_Price = ?, Main_Image_Url = ?, Long_Description = ?, SKU = ? WHERE idProduct = ?',
      [description, product_brand_id, market_price, selling_price, main_image_url, long_description, sku, id]
    );
    
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Product WHERE idProduct = ?', [id]);
    return result.affectedRows;
  }

  static async count() {
    const [result] = await pool.query('SELECT COUNT(*) as total FROM Product');
    return result[0].total;
  }
}

module.exports = Product; 