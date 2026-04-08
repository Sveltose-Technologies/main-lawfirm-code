const express = require("express");
const router = express.Router();

const locationPageController = require("../controllers/locationPageController");
const upload = require("../middleware/upload");

router.post(
  "/create",
  upload.single("bannerImage"),
  locationPageController.createLocationPage
);

router.get("/get-all", locationPageController.getAllLocationPages);

router.get("/get-by-id/:id", locationPageController.getLocationPageById);

router.put(
  "/update/:id",
  upload.single("bannerImage"),
  locationPageController.updateLocationPage
);

router.delete("/delete/:id", locationPageController.deleteLocationPage);

module.exports = router;