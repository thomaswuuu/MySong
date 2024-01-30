const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const bcrpyt = require("bcrypt");
const JWT = require("jsonwebtoken");
const JWTSecret = process.env.JWT_SECRET;

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send(err);
    // Remove JWT token
    res.clearCookie("jwt_token");
    return res.redirect("/auth/login");
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    // Create JWT token
    const user = req.user;
    const token = JWT.sign({ user }, JWTSecret, { expiresIn: "1h" });
    res.cookie("jwt_token", token);
    return res.redirect("/profile");
  }
);

router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    // Email check
    let foundEmail = await User.findOne({ email }).exec();
    if (foundEmail) {
      req.flash("error_msg", "信箱已被註冊，請使用另一個信箱。");
      return res.redirect("/auth/signup");
    }
    // Password check
    if (password.length < 8) {
      req.flash("error_msg", "密碼長度過短，至少8個數字或英文。");
      return res.redirect("/auth/signup");
    }
    // Save new user to database
    let hashedPassword = await bcrpyt.hash(password, 12);
    let newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    req.flash("success_msg", "註冊成功，現在可以登入系統。");
    return res.redirect("/auth/login");
  } catch (error) {
    res.send(error);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "登入失敗，信箱或密碼不正確",
  }),
  (req, res) => {
    // Create JWT token
    const user = req.user;
    const token = JWT.sign({ user }, JWTSecret, { expiresIn: "1h" });
    res.cookie("jwt_token", token);
    // Redirect to profile
    return res.redirect("/profile");
  }
);

module.exports = router;
