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
router.get("/categories", productController.getAllCategories);
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
router.delete(
  "/categories/:id",
  authenticate,
  productController.deleteCategory
);

// --------------------
// Sub-Category Routes
// --------------------
router.post(
  "/categories/:id/sub-categories",
  authenticate,
  productController.createSubCategory
);
router.put(
  "/categories/:id/sub-categories/:subId",
  authenticate,
  productController.updateSubCategory
);
router.delete(
  "/categories/:id/sub-categories/:subId",
  authenticate,
  productController.deleteSubCategory
);

// -------------
// Brand Routes
// -------------
router.post(
  "/brands",
  upload.single("brandImage"),
  productController.createBrand
);
router.put(
  "/brands/:id",
  authenticate,
  upload.single("brandImage"),
  productController.updateBrand
);
router.delete("/brands/:id", authenticate, productController.deleteBrand);
router.get("/brands", productController.getBrands);

// ---------------
// Product Routes
// ---------------
router.post("/", authenticate, cpUpload, productController.createProduct);
router.put("/:id", authenticate, cpUpload, productController.updateProduct);
router.patch(
  "/:id/history-status",
  authenticate,
  productController.toggleProductHistoryStatus
);
router.patch(
  "/:id/status",
  authenticate,
  productController.toggleProductStatus
);
router.get("/", productController.getAllProducts);
router.get("/count", productController.getProductTotal);
router.get("/sold-qty", productController.getProductsSoldQty);
router.get("/:id/sold-qty", productController.getProductSoldQty);
router.get(
  "/sub-categories/:subId/products",
  productController.getProductsBySubCategory
);
router.get("/brands/:brandId/products", productController.getProductsByBrand);
router.get("/:id", productController.getProductById);
router.delete("/:id", authenticate, productController.deleteProduct);
router.get(
  "/sub-categories/:subId/products",
  productController.getProductsBySubCategory
);
router.get("/categories/top-selling", productController.getTopSellingCategories);
router.get("/brands/:brandId/products", productController.getProductsByBrand);
router.get("/:id", productController.getProductById);
router.delete("/:id", authenticate, productController.deleteProduct);

// ----------------
// Discount Routes
// ----------------
router.get("/discounts/all", productController.getAllDiscounts);
router.get("/discounts/:id", productController.getDiscountById);
router.get(
  "/products/:productId/discounts",
  productController.getDiscountsByProductId
);
router.post("/discounts", authenticate, productController.createDiscount);
router.put("/discounts/:id", authenticate, productController.updateDiscount);
router.delete("/discounts/:id", authenticate, productController.deleteDiscount);

module.exports = router;
