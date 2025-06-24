const express = require("express");
const multer = require("multer");
const authenticate = require("../../middleware/authMiddleware");
const eventController = require("../../controllers/admin/event.controller");

const router = express.Router();

// Configure Multer Storage for event images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// -------------
// Event Routes
// -------------
router.get("/all", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.get("/:eventId/products", eventController.getEventProducts);
router.post(
  "/",
  authenticate,
  upload.single("eventImage"),
  eventController.createEvent
);
router.put(
  "/:id",
  authenticate,
  upload.single("eventImage"),
  eventController.updateEvent
);
router.delete("/:id", authenticate, eventController.deleteEvent);

module.exports = router;
