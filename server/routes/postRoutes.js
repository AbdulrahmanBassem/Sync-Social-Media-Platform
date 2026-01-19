const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { upload } = require("../utils/upload");

router.get("/", postController.getAllPosts); // Get Feed
router.get("/:id", postController.getPostById); // Get Single Post

router.post(
  "/", 
  authMiddleware, 
  upload.array("images", 5), 
  postController.createPost
);

router.delete("/:id", authMiddleware, postController.deletePost);
router.put("/:id/like", authMiddleware, postController.likePost);

module.exports = router;