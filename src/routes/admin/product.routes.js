const express = require("express");
const multer = require("multer");
const authenticate = require("../../middleware/authMiddleware");
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

// Configure Multer to accept one main image and multiple sub images
const upload = multer({ storage });
const cpUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "subImages", maxCount: 10 },
]);

// ----------------
// Category Routes
// ----------------
router.get("/categories", authenticate, productController.getAllCategories);
router.post(
  "/categories",
  authenticate,
  upload.single("image"),
  productController.createCategory
);
router.put(
  "/categories/:id",
  authenticate,
  upload.single("image"),
  productController.updateCategory
);
router.patch(
  "/categories/:id/status",
  authenticate,
  productController.toggleCategoryStatus
);

// --------------------
// Sub-Category Routes
// --------------------
router.post(
  "/categories/:id/sub-categories",
  authenticate,
  productController.createSubCategory
);
router.delete(
  "/categories/:id/sub-categories/:subId",
  authenticate,
  productController.deleteSubCategory
);

// ---------------
// Product Routes
// ---------------
router.post("/", authenticate, cpUpload, productController.createProduct);
router.post(
  "/brands",
  upload.single("brandImage"),
  productController.createBrand
);
router.get("/brands", authenticate, productController.getBrands);
router.put("/:id", authenticate, cpUpload, productController.updateProduct);
router.get("/", authenticate, productController.getAllProducts);
router.get("/:id", authenticate, productController.getProductById);
router.delete("/:id", authenticate, productController.deleteProduct);

module.exports = router;
