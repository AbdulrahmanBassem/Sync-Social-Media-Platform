const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("MONGO CLOUD CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log("Database Connection Error:", error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };