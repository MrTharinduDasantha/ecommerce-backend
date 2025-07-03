const express = require("express")
const authenticateToken = require("../../middleware/authMiddleware")
const reviewController = require("../../controllers/customer/review.controller")

const router = express.Router()

router.post("/product", authenticateToken, reviewController.submitProductReview)
router.post("/order", authenticateToken, reviewController.submitOrderReview)
router.get("/product/:id", reviewController.getReviewsByProductId)
router.get(
  "/order/:id",
  authenticateToken,
  reviewController.getReviewsByOrderId
)
router.put("/order/:id", authenticateToken, reviewController.updateOrderReview)
router.delete(
  "/order/:id",
  authenticateToken,
  reviewController.deleteOrderReview
)

module.exports = router
