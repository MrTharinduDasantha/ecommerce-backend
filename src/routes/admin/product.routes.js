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
  upload.single("image"),
  productController.createCategory
);
router.put(
  "/categories/:id",
  upload.single("image"),
  productController.updateCategory
);
router.patch("/categories/:id/status", productController.toggleCategoryStatus);

// --------------------
// Sub-Category Routes
// --------------------
router.post(
  "/categories/:id/sub-categories",
  productController.createSubCategory
);
router.delete(
  "/categories/:id/sub-categories/:subId",
  productController.deleteSubCategory
);

// ---------------
// Product Routes
// ---------------
router.post("/", cpUpload, productController.createProduct);
router.post("/brands", productController.createBrand);
router.get("/brands", productController.getBrands);
router.put("/:id", cpUpload, productController.updateProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
