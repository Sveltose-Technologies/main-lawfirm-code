const express = require("express");

const router = express.Router();

const controller = require("../controllers/careerAttorneyController");
const upload = require("../middleware/upload");

router.post("/create", upload.single("image"), controller.createCareerAttorney);

// get all
router.get("/get-all", controller.getAllCareerAttorneys);       

// get by id
router.get("/get-by-id/:id", controller.getCareerAttorneyById);

// update
router.put("/update/:id", upload.single("image"), controller.updateCareerAttorney);

// delete
router.delete("/delete/:id", controller.deleteCareerAttorney);

module.exports = router;
