const express = require("express");
const router = express.Router();
const socialMediaController = require("../controllers/socialMediaController");

router.post("/create", socialMediaController.createSocialMedia);
router.get("/get-all", socialMediaController.getAllSocialMedia);
router.get("/get-by-id/:id", socialMediaController.getSocialMediaById);
router.put("/update/:id", socialMediaController.updateSocialMedia);
router.delete("/delete/:id", socialMediaController.deleteSocialMedia);

module.exports = router;
