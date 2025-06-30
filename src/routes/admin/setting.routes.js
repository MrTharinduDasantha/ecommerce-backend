const express = require("express");
const multer = require("multer");
const authenticate = require("../../middleware/authMiddleware");
const settingController = require("../../controllers/admin/setting.controller");

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

// Initialize Multer with storage configuration
const upload = multer({ storage });

// Configure Multer to accept any fields
const uploadFiles = upload.any();

// -----------------------------
// Header Footer Setting Routes
// -----------------------------
router.get("/header-footer", settingController.getHeaderFooterSetting);
router.put(
  "/header-footer",
  authenticate,
  uploadFiles,
  settingController.updateHeaderFooterSetting
);

// -----------------------------
// About Us Setting Routes
// -----------------------------
router.get("/about-us", settingController.getAboutUsSetting);
router.put(
  "/about-us",
  authenticate,
  uploadFiles,
  settingController.updateAboutUsSetting
);

module.exports = router;
