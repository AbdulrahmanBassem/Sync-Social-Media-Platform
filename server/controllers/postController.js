const { Post } = require("../models/Post");
const { createPostSchema } = require("../validation/postValidator");
const { Notification } = require("../models/Notification"); 

exports.createPost = async (req, res) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }
    // const images = req.files.map((file) => `/uploads/${file.filename}`);
    const images = req.files.map((file) => file.path);

    const { caption, tags } = value;
    const formattedTags = tags 
      ? (Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim())) 
      : [];

    const post = await Post.create({
      userId: req.user.id,
      caption,
      images,
      tags: formattedTags,
    });

    await post.populate("userId", "name username profilePic");

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("userId", "name username profilePic")
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "name username profilePic");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(404).json({ message: "Post not found" });
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);

      if (post.userId.toString() !== userId) {
        await Notification.create({
          recipient: post.userId,
          sender: userId,
          type: "like",
          postId: post._id,
        });
      }
    }

    await post.save();
    res.json({ message: isLiked ? "Post unliked" : "Post liked", likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const posts = await Post.find({
      $or: [
        { caption: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } }, 
      ],
    })
      .populate("userId", "name username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};