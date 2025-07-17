const pool = require("../config/database")

//Add product review
const addProductReview = async (customer_id, product_id, rating, comment) => {
  const [result] = await pool.query(
    "INSERT INTO Review (Customer_idCustomer, Product_idProduct, Rating_5, Comment) VALUES (?, ?, ?, ?)",
    [customer_id, product_id, rating, comment]
  )
  return result.insertId
}

//Add order review
const addOrderReview = async (customer_id, order_id, rating, comment) => {
  const [result] = await pool.query(
    "INSERT INTO Order_Review (customer_id, order_id, rating, comment, status) VALUES (?, ?, ?, ?, ?)",
    [customer_id, order_id, rating, comment, "inactive"]
  )
  return result.insertId
}

//Get reviews by product id
const getByProductId = async product_id => {
  const [result] = await pool.query(
    "SELECT * FROM Review WHERE Product_idProduct=?",
    [product_id]
  )
  return result
}

//Get reviews by order id
const getByOrderId = async order_id => {
  const [result] = await pool.query(
    "SELECT * FROM Order_Review WHERE order_id=?",
    [order_id]
  )
  return result
}

//Get review by review id
const getByReviewId = async review_id => {
  const [result] = await pool.query(
    "SELECT * FROM Order_Review WHERE review_id=?",
    [review_id]
  )
  return result
}

//Get all order reviews
const getAll = async () => {
  const [result] = await pool.query("SELECT * FROM Order_Review")
  return result
}

//Get all active order reviews
const getActive = async () => {
  const [result] = await pool.query(
    "SELECT * FROM Order_Review WHERE status=?",
    ["active"]
  )
  return result
}

//Update order review
const updateByOrderId = async (order_id, rating, comment) => {
  const fields = []
  const values = []
  if (rating !== undefined) {
    fields.push("rating = ?")
    values.push(rating)
  }
  if (comment !== undefined) {
    fields.push("comment = ?")
    values.push(comment)
  }
  if (fields.length === 0) throw new Error("No fields to update")
  values.push(order_id)
  const query = `UPDATE Order_Review SET ${fields.join(", ")} WHERE order_id=?`
  await pool.query(query, values)
  return { message: "Order Review Updated" }
}

//Update order review status
const updateStatus = async review_id => {
  const [currentStatus] = await pool.query(
    "SELECT status FROM Order_Review WHERE review_id=?",
    [review_id]
  )
  if (currentStatus.length === 0) throw new Error("Review not found")
  const newStatus = currentStatus[0].status === "active" ? "inactive" : "active"
  await pool.query("UPDATE Order_Review SET status = ? WHERE review_id=?", [
    newStatus,
    review_id,
  ])
  return { message: `Review status updated to ${newStatus}` }
}

//Delete order review
const deleteByOrderId = async order_id => {
  await pool.query("DELETE FROM Order_Review WHERE order_id=?", [order_id])
  return { message: "Order Review Deleted" }
}

module.exports = {
  addProductReview,
  addOrderReview,
  getByProductId,
  getByOrderId,
  getByReviewId,
  updateByOrderId,
  deleteByOrderId,
  getAll,
  updateStatus,
  getActive
}
