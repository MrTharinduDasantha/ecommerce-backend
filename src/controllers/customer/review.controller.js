const { addReview } = require("../../models/review.model")

class ReviewController {
  async submitReview(req, res) {
    try {
      const { customer_id, product_id, rating, comment } = req.body
      const authenticatedCustomerId = req.user.customerId
      if (parseInt(customer_id, 10) !== authenticatedCustomerId) {
        return res.status(403).json({
          message:
            "Unauthorized: customer_id does not match authenticated user.",
        })
      }
      const review_id = await addReview(
        customer_id,
        product_id,
        rating,
        comment
      )
      res.status(201).json({ review_id, message: "Review submitted successfully" })
    } catch (error) {
      console.error("Error submitting review: ", error)
      res
        .status(500)
        .json({ message: "Failed to submit review", error: error.message })
    }
  }
}

module.exports = new ReviewController()
