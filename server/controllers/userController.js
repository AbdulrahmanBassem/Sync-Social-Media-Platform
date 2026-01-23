const { User } = require("../models/User");
const { Post } = require("../models/Post");
const { updateProfileSchema } = require("../validation/userValidator");


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") return res.status(404).json({ message: "User not found" });
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, bio } = value;
    const userId = req.user.id;

    // Find and Update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, bio } },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpires");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const userId = req.user.id;
    // const profilePicPath = `/uploads/${req.file.filename}`; 
    const profilePicPath = req.files.map((file) => file.path);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicPath },
      { new: true }
    ).select("-password");

    res.json({ 
      message: "Profile picture updated", 
      profilePic: updatedUser.profilePic 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ userId: id })
      .sort({ createdAt: -1 })
      .populate("userId", "name username profilePic");
      
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query parameter required" });

    // Search by name or username 
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    }).select("name username profilePic bio");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};