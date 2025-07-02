const express = require("express")
const authenticateToken = require("../../middleware/authMiddleware")
const reviewController = require("../../controllers/customer/review.controller")

const router = express.Router()

router.use(authenticateToken)

router.post("/", reviewController.submitReview)

module.exports = router