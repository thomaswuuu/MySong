const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getAllCharts);
router.get("/tracks", controller.getTracks);
router.get("/follows", controller.getFollows);
router.post("/follows", controller.setFollows);

module.exports = router;
