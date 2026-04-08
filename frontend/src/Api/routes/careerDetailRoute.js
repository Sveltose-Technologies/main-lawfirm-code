const express = require("express");
const router = express.Router();

const controller = require("../controllers/careerDetailController");
const upload = require("../middleware/upload");

router.post(
  "/create",
  upload.fields([
    { name: "bannerImage", maxCount: 1 }
  ]),
  controller.createCareerDetail
);

router.get("/get-all", controller.getAllCareerDetails);

router.get("/get-by-id/:id", controller.getCareerDetailById);

router.put(
  "/update/:id",
  upload.fields([
    { name: "bannerImage", maxCount: 1 }
  ]),
  controller.updateCareerDetail
);

router.delete("/delete/:id", controller.deleteCareerDetail);

module.exports = router;