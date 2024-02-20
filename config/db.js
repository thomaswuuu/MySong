const mongoose = require("mongoose");
require("dotenv").config();
const dbPath = process.env.MONGO_URI;
const dbName = process.env.MONGO_DATABASE;
const dbUsername = process.env.MONGO_ADMIN;
const dbPassword = process.env.MONGO_PASSWORD;

const connectDB = async () => {
  try {
    await mongoose.connect(`${dbPath}/${dbName}`, {
      authSource: "admin",
      user: dbUsername,
      pass: dbPassword,
    });
    console.log("Connect to MongoDB successfully!");
  } catch (error) {
    console.log("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
