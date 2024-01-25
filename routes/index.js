const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getAllCharts);
router.get("/getTracks", controller.getTracks);

module.exports = router;
