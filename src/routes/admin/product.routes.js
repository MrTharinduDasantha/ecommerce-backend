const express = require("express");
const multer = require("multer");
const productController = require("../../controllers/admin/product.controller");

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create an Instance of Multer
const upload = multer({ storage });

// Category Routes
router.get("/categories", productController.getAllCategories);
router.post(
  "/categories",
  upload.single("image"),
  productController.createCategory
);
router.put(
  "/categories/:id",
  upload.single("image"),
  productController.updateCategory
);
router.patch("/categories/:id/status", productController.toggleCategoryStatus);

// Sub-Category Routes
router.post(
  "/categories/:id/sub-categories",
  productController.createSubCategory
);
router.delete(
  "/categories/:id/sub-categories/:subId",
  productController.deleteSubCategory
);

module.exports = router;
