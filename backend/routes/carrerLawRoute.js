const express = require("express");

const router = express.Router();    

const controller = require("../controllers/careerLawController");
const upload = require("../middleware/upload"); 

router.post("/create", upload.single("image"), controller.createCareerLaw);
router.get("/get-all", controller.getAllCareerLaws);
router.get("/get-by-id/:id", controller.getByCategoryId);
router.put("/update/:id", upload.single("image"), controller.updateCareerLaw);
router.delete("/delete/:id", controller.deleteCareerLaw);

module.exports = router;