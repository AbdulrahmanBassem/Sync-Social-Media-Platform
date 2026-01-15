const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { upload } = require("../utils/upload");

// Public Routes
router.get("/search", userController.searchUsers); 
router.get("/:id", userController.getUserProfile); 
router.get("/:id/posts", userController.getUserPosts); 

// Protected Routes
router.put("/profile", authMiddleware, userController.updateUserProfile); 
router.post(
  "/profile/picture", 
  authMiddleware, 
  upload.single("image"), 
  userController.updateProfilePicture
);

module.exports = router;