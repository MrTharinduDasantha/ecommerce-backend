const pool = require("../config/database")

//Add review
const addReview = async (customer_id, product_id, rating, comment) => {
  const [result] = await pool.query(
    "INSERT INTO Review (Customer_idCustomer, Product_idProduct, Rating_5, Comment) VALUES (?, ?, ?, ?)",
    [customer_id, product_id, rating, comment]
  )
  return result.insertId;
}

module.exports = {addReview}