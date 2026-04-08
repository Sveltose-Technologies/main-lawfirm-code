const express = require("express");

const router = express.Router();

const controller = require("../controllers/carrerBannerController");
const upload = require("../middleware/upload");     

// create
router.post("/create", upload.single("bannerImage"), controller.createCareerBanner);    

// get all
router.get("/get-all", controller.getAllCareerBanner); 

// get by id
router.get("/get-by-id/:id", controller.getCareerBannerById);

// update   
router.put("/update/:id", upload.single("bannerImage"), controller.updateCareerBanner);

// delete
router.delete("/delete/:id", controller.deleteCareerBanner);  

module.exports = router;