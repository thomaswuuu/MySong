const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  ID: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
