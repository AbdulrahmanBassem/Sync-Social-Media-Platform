// imports
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { connectToDatabase } = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Config
dotenv.config();

// App
const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectToDatabase();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
app.use(limiter);

// Main Route
app.get("/", (req, res) => {
  res.send("Welcome To Social Media API");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SERVER RUNNING @PORT: ${PORT}`);
  });
}

module.exports = app;