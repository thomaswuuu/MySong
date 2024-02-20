const mongoose = require("mongoose");
const bcrpyt = require("bcrypt");
const User = require("../models/userModel");
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
    // Create default admin user
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const foundEmail = await User.findOne({ email });
    if (!foundEmail) {
      let hashedPassword = await bcrpyt.hash(password, 12);
      let newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      if (savedUser) {
        console.log("Admin user is created successfully!");
      }
    }

    console.log("Connect to MongoDB successfully!");
  } catch (error) {
    console.log("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
