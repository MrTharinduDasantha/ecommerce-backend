// src/config/database.js
const mysql = require("mysql2/promise");
require("dotenv").config();

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "NewStrongPassword",
  database: process.env.DB_NAME || "medusa_ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
