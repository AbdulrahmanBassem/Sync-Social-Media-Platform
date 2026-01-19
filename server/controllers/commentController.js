const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
const { Notification } = require("../models/Notification");
const { createCommentSchema } = require("../validation/commentValidator");

exports.createComment = async (req, res) => {
  try {
    const { error, value } = createCommentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { postId, text } = value;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      postId,
      userId,
      text,
    });

    
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    if (post.userId.toString() !== userId) {
      await Notification.create({
        recipient: post.userId,
        sender: userId,
        type: "comment",
        postId,
      });
    }

    await comment.populate("userId", "name username profilePic");

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const comments = await Comment.find({ postId })
      .populate("userId", "name username profilePic")
      .sort({ createdAt: -1 }); 

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });


    const post = await Post.findById(comment.postId);
    
    const isCommentOwner = comment.userId.toString() === req.user.id;
    const isPostOwner = post && post.userId.toString() === req.user.id;

    if (!isCommentOwner && !isPostOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    await comment.deleteOne();

    if (post) {
      await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });
    }

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};