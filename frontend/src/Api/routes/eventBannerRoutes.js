const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/eventBannerController");
const upload = require("../middleware/upload");

// Routes
router.post("/create", upload.single("bannerImage"), bannerController.createBanner);

router.get("/get-all", bannerController.getAllBanner);

router.get("/get-by-id/:id", bannerController.getBannerById);

router.put("/update/:id", upload.single("bannerImage"), bannerController.updateBanner);

router.delete("/delete/:id", bannerController.deleteBanner);

module.exports = router;