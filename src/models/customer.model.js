const pool = require('../config/database');

class Customer {
  static async findAll(limit, offset) {
    const [rows] = await pool.query(
      'SELECT * FROM Customer ORDER BY idCustomer DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE Email = ?', [email]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE idCustomer = ?', [id]);
    return rows.length ? rows[0] : null;
  }

  static async create(customerData) {
    const { first_name, full_name, email, password, mobile_no, status } = customerData;
    const [result] = await pool.query(
      'INSERT INTO Customer (First_Name, Full_Name, Email, Password, Mobile_No, Status) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, full_name, email, password, mobile_no, status || 'active']
    );
    return result.insertId;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE Customer SET Status = ? WHERE idCustomer = ?',
      [status, id]
    );
    return result.affectedRows;
  }

  static async updatePassword(id, newPassword) {
    const [result] = await pool.query(
      'UPDATE Customer SET Password = ? WHERE idCustomer = ?',
      [newPassword, id]
    );
    return result.affectedRows;
  }

  static async count() {
    const [result] = await pool.query('SELECT COUNT(*) as count FROM Customer');
    return result[0].count;
  }
}

module.exports = Customer; 