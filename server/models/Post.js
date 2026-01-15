const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: { type: String, default: "" },
    images: [{ type: String }], 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }], 
    
    
    commentsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

postSchema.index({ caption: "text", tags: "text" });

const Post = mongoose.model("Post", postSchema);
module.exports = { Post };