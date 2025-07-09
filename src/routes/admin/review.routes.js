const express = require("express")
const authenticateToken = require("../../middleware/authMiddleware")
const { getAllOrderReviews, getReviewByReviewId, updateOrderReviewStatus } = require("../../controllers/admin/review.controller")

const router = express.Router()

router.get("/", authenticateToken, getAllOrderReviews)
router.get("/:id", authenticateToken, getReviewByReviewId)
router.put("/:id", authenticateToken, updateOrderReviewStatus)

module.exports = router