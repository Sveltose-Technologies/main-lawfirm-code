const express = require("express");
const router = express.Router();
const homeRankingController = require("../controllers/homeRanking.controller");

router.post("/create", homeRankingController.createHomeRanking);
router.get("/getall", homeRankingController.getHomeRanking);
router.put("/update/:id", homeRankingController.updateHomeRanking);
router.delete("/delete/:id", homeRankingController.deleteHomeRanking);

module.exports = router;