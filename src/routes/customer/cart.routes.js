const express = require("express");
const cartController = require("../../controllers/customer/cart.controller");

const router = express.Router();

// -------------
// Cart Routes
// -------------
router.get("/:customerId", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCartItem);
router.delete("/remove", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);
router.put("/note", cartController.addNoteToCartItem);
router.post("/checkout", cartController.checkout);

module.exports = router;
