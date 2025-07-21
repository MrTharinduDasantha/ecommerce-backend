// src/config/database.js
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Sequelize Connection for ORM models
const sequelize = new Sequelize(
  process.env.DB_NAME || "medusa_ecommercev3",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
);

// MySQL Connection Pool for raw SQL queries
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "medusa_ecommercev3",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Export both for backward compatibility
// Default export is the pool for raw SQL queries
module.exports = pool;
// Named export for Sequelize ORM
module.exports.sequelize = sequelize;