const express = require("express");
const multer = require("multer");
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

// Configure Multer to accept navbar logo
const upload = multer({ storage });

// -----------------------------
// Header Footer Setting Routes
// -----------------------------
router.get("/header-footer", settingController.getHeaderFooterSetting);
router.put(
  "/header-footer",
  upload.single("navbarLogo"),
  settingController.updateHeaderFooterSetting
);

module.exports = router;
