const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/", messageController.sendMessage);

router.get("/conversations", messageController.getConversations);

router.get("/:conversationId", messageController.getMessages);

module.exports = router;