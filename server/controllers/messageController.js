const { Conversation } = require("../models/Conversation");
const { Message } = require("../models/Message");
const { User } = require("../models/User");
const { Notification } = require("../models/Notification");

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !text) {
      return res.status(400).json({ message: "Recipient and text are required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
      });
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text,
    });

    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: {
        text,
        sender: senderId,
        seen: false,
        createdAt: new Date(),
      },
    });

    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: "message", 
      postId: null, 
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] },
    })
      .populate("participants", "name username profilePic")
      .sort({ updatedAt: -1 }); 

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }); 

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};