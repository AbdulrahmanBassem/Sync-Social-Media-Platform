const mongoose = require("mongoose");
const path = require("path");

const userSchema = new mongoose.Schema(
  {
    // Auth Info
    username: { type: String, required: true, unique: true, trim: true }, 
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // OTP & Verification
    otp: { type: String },
    otpExpires: { type: Date },
    isVerify: { type: Boolean, default: false },

    // Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // Profile Info
    name: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePic: {
      type: String,
      default: "/public/default-profile-picture.png", 
    },
    
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };