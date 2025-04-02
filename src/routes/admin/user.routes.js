const express = require("express");
const userController = require("../../controllers/admin/user.controller");
const authenticate = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/login", userController.loginUser);
router.post("/", userController.createUser);

router.get("/profile", authenticate, userController.getProfile);

router.get("/:id", authenticate, userController.getUser);
router.get("/", authenticate, userController.getUsers);
router.put("/:id", authenticate, userController.updateUser);
router.delete("/:id", authenticate, userController.deleteUser);

router.put("/:id/status", userController.updateUserStatus);
router.put("/:id/password", authenticate, userController.updateUserPassword);

module.exports = router;
