const User = require("../models/userModel");
const Follow = require("../models/followModel");
const bcrpyt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    if (userData) {
      const users = userData.map((user) => {
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          thumbnail: user.thumbnail || "",
          date: user.date,
        };
      });
      return res.status(200).json(users);
    } else {
      return res.status(200).json({ message: "No user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const userData = await User.findOne({ _id: user_id });
    if (userData) {
      const user = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        thumbnail: userData.thumbnail || "",
        date: userData.date,
      };
      return res.status(200).json(user);
    } else {
      return res.status(200).json({ message: "User does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const setUser = async (req, res) => {
  try {
    const { name, email, password, thumbnail } = req.body;
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      return res.status(200).json({
        message: "This email has been signed up, please use another one",
      });
    }

    // Password check
    if (password.length < 8) {
      return res.status(200).json({
        message: "Password is too short. At least 8 numbers or english letters",
      });
    }
    // Save new user to database
    let hashedPassword = await bcrpyt.hash(password, 12);
    let newUser = new User({
      name,
      email,
      password: hashedPassword,
      thumbnail,
    });
    await newUser.save();
    return res.status(201).json({ message: "Sign up successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const queryData = { _id: user_id };
    const count = await User.countDocuments(queryData);
    // Check if user does exist
    if (count) {
      const updateData = req.body;
      // Find user and update data
      await User.findOneAndUpdate(queryData, updateData);
      return res.status(201).json({ message: "Update user successfully!" });
    } else {
      return res.status(200).json({ message: "This user does not exist." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const queryData = { _id: user_id };
    const count = await User.countDocuments(queryData);
    // Check if user does exist
    if (count) {
      // Find user and delete data
      await User.findOneAndDelete(queryData);
      await Follow.deleteMany(queryData);
      return res.status(201).json({ message: "Delete user successfully!" });
    } else {
      return res.status(200).json({ message: "This user does not exist." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getUser, setUser, updateUser, deleteUser };
