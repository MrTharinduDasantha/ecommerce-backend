const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM User WHERE Email = ?', [email]);
    return rows.length ? rows[0] : null;
  }

  static async authenticate(email, password) {
    const [rows] = await pool.query(
      'SELECT * FROM User WHERE Email = ? AND Password = ? AND Status = "active"', 
      [email, password]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const user = rows[0];
    return {
      id: user.idUser,
      name: user.Full_Name,
      email: user.Email,
      role: 'admin', // This is a placeholder. In production, use proper role management
    };
  }

  static async create(userData) {
    const { full_name, email, password, phone_no } = userData;
    const [result] = await pool.query(
      'INSERT INTO User (Full_Name, Email, Password, Phone_No, Status) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, password, phone_no, 'active']
    );
    return result.insertId;
  }
}

module.exports = User; 