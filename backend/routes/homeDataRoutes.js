const express = require("express");
const homeDataController = require("../controllers/homeDataController");
const upload = require("../middleware/upload");

const router = express.Router();

// CREATE
router.post(
  "/create",
  upload.fields([
    { name: "firstImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
    { name: "fourthImage", maxCount: 1 },
  ]),
  homeDataController.createHomeData
);

// GET ALL
router.get("/get-all", homeDataController.getAllHomeData);

// GET BY ID
router.get("/get-by-id/:id", homeDataController.getHomeDataById);

// UPDATE
router.put(
  "/update/:id",
  upload.fields([
    { name: "firstImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
    { name: "fourthImage", maxCount: 1 },
  ]),
  homeDataController.updateHomeData
);

// DELETE
router.delete("/delete/:id", homeDataController.deleteHomeData);

module.exports = router;