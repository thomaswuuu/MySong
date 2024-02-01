const express = require("express");
const router = express.Router();
const controller = require("../controllers/profileController");
const JWT = require("jsonwebtoken");
const JWTSecret = process.env.JWT_SECRET;

const JWTAuthCheck = (req, res, next) => {
  const token = req.cookies.jwt_token;
  if (!token) {
    req.flash("error_msg", "登入憑證已過期，請重新登入。");
    return res.redirect("/auth/login");
  }

  JWT.verify(token, JWTSecret, (err, decoded) => {
    if (err) {
      req.flash("error_msg", "登入憑證已失效，請重新登入。");
      return res.redirect("/auth/login");
    }
    next();
  });
};

router.get("/", JWTAuthCheck, controller.getUserProfile);
router.get("/follows", controller.getFollows);
router.post("/follows", controller.setFollows);

module.exports = router;
