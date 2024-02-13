const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const auth = require("../controllers/authController");
const passport = require("passport");

// Login and create token
router.post("/login", passport.authenticate("local"), auth.createAuthToken);

// Add middleware and check login token for super user
router.use("/charts", auth.superAuthCheck);
router.get("/charts", indexController.getCharts);
router.post("/charts", indexController.setCharts);
router.put("/charts", indexController.updateCharts);
router.delete("/charts", indexController.deleteCharts);

router.use("/tracks", auth.superAuthCheck);
router.get("/tracks", indexController.getTracks);
router.post("/tracks", indexController.setTracks);
router.put("/tracks", indexController.updateTracks);
router.delete("/tracks", indexController.deleteTracks);

router.use("/users", auth.superAuthCheck);
router.get("/users", userController.getAllUsers);
router.get("/users/:user_id", userController.getUser);
router.post("/users", userController.setUser);
router.put("/users/:user_id", userController.updateUser);
router.delete("/users/:user_id", userController.deleteUser);

// Add middleware and check login token for normal user
router.use("/follows", auth.normalAuthCheck);
router.get("/follows", profileController.getUserAllFollows);
router.get("/follows/:track_id", profileController.getUserFollow);
router.post("/follows", profileController.setUserFollow);
router.put("/follows/:track_id", profileController.updateUserFollow);
router.delete("/follows/:track_id", profileController.deleteUserFollow);

module.exports = router;
