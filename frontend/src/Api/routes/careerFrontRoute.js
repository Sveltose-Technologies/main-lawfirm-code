const express = require("express");
const router = express.Router();
const controller = require("../controllers/careerFrontController");
const upload = require("../middleware/upload");

// create
router.post("/create", 
      upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "firstImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
  ]),
    controller.createCareerFront);

// get all
router.get("/get-all", controller.getAllCareerFront);

// get by id
router.get("/get-by-id:id", controller.getCareerFrontById);

// update
router.put("/update/:id",
       upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "firstImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
  ]),
    controller.updateCareerFront);

// delete
router.delete("/delete/:id", controller.deleteCareerFront);

module.exports = router;