const {
  getByProductId,
  addProductReview,
  addOrderReview,
  getByOrdertId,
  updateByOrderId,
  deleteByOrderId,
} = require("../../models/review.model")

class ReviewController {
  async submitProductReview(req, res) {
    try {
      const { customer_id, product_id, rating, comment } = req.body
      const authenticatedCustomerId = req.user.customerId
      if (parseInt(customer_id, 10) !== authenticatedCustomerId) {
        return res.status(403).json({
          message:
            "Unauthorized: customer_id does not match authenticated user.",
        })
      }
      const review_id = await addProductReview(
        customer_id,
        product_id,
        rating,
        comment
      )
      res
        .status(201)
        .json({ review_id, message: "Review submitted successfully" })
    } catch (error) {
      console.error("Error submitting review: ", error)
      res
        .status(500)
        .json({ message: "Failed to submit review", error: error.message })
    }
  }
  async submitOrderReview(req, res) {
    try {
      const { customer_id, order_id, rating, comment } = req.body
      const authenticatedCustomerId = req.user.customerId
      if (parseInt(customer_id, 10) !== authenticatedCustomerId) {
        return res.status(403).json({
          message:
            "Unauthorized: customer_id does not match authenticated user.",
        })
      }
      const review_id = await addOrderReview(
        customer_id,
        order_id,
        rating,
        comment
      )
      res
        .status(201)
        .json({ review_id, message: "Review submitted successfully" })
    } catch (error) {
      console.error("Error submitting review: ", error)
      res
        .status(500)
        .json({ message: "Failed to submit review", error: error.message })
    }
  }
  async getReviewsByProductId(req, res) {
    try {
      const reviews = await getByProductId(req.params.id)
      if (reviews.length === 0) {
        return res.status(404).json({ message: "This product has no reviews." })
      }
      res.json(reviews)
    } catch (error) {
      console.error("Error getting product reviews: ", error)
      res.status(500).json({
        message: "Failed to get product reviews",
        error: error.message,
      })
    }
  }
  async getReviewsByOrderId(req, res) {
    try {
      const reviews = await getByOrdertId(req.params.id)
      if (reviews.length === 0) {
        return res.status(404).json({ message: "This order has no reviews." })
      }
      res.json(reviews)
    } catch (error) {
      console.error("Error getting product reviews: ", error)
      res.status(500).json({
        message: "Failed to get product reviews",
        error: error.message,
      })
    }
  }
  async updateOrderReview(req, res) {
    try {
      const orderId = req.params.id
      const { rating, comment } = req.body
      const result = await updateByOrderId(orderId, rating, comment)
      res.send(result)
    } catch (error) {
      console.error("Error updating review: ", error)
      res.status(500).json({
        message: "Failed to update order review",
        error: error.message,
      })
    }
  }
  async deleteOrderReview(req, res) {
    try {
      const orderId = req.params.id
      const result = await deleteByOrderId(orderId)
      res.send(result)
    } catch (error) {
      console.error("Error deleting review: ", error)
      res.status(500).json({
        message: "Failed to delete order review",
        error: error.message,
      })
    }
  }
}

module.exports = new ReviewController()
