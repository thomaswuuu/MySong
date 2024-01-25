const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  return res.render("login", { user: null });
});

router.get("/signup", (req, res) => {
  return res.render("signup", { user: null });
});

router.get("/logout", (req, res) => {
  return res.redirect("/auth/login");
});

module.exports = router;
