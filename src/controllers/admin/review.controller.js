const {
  getAll,
  getByReviewId,
  updateStatus,
} = require("../../models/review.model")

const getAllOrderReviews = async (req, res) => {
  try {
    const reviews = await getAll()
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: "Database error" })
  }
}

const getReviewByReviewId = async (req, res) => {
  try {
    const review = await getByReviewId(req.params.id)
    res.json(review)
  } catch (error) {
    console.error("Error getting review details: ", error)
    res.status(500).json({
      message: "Failed to get review details",
      error: error.message,
    })
  }
}

const updateOrderReviewStatus = async (req, res) => {
  try {
    const reviewId = req.params.id
    const result = await updateStatus(reviewId)
    res.send(result)
  } catch (error) {
    console.error("Error updating review status: ", error)
    res.status(500).json({
      message: "Failed to update review status",
      error: error.message,
    })
  }
}

module.exports = {
  getAllOrderReviews,
  getReviewByReviewId,
  updateOrderReviewStatus
}
