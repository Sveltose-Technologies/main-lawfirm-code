const express = require("express");
const router = express.Router();
const homeCountController = require("../controllers/homeCount.controller");

router.post("/create", homeCountController.createHomeCount);
router.get("/getall", homeCountController.getHomeCount);
router.put("/update/:id", homeCountController.updateHomeCount);
router.delete("/delete/:id", homeCountController.deleteHomeCount);

module.exports = router;