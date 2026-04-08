const express = require("express");
const router = express.Router();

const controller = require("../controllers/careerProfessionalController");
const upload = require("../middleware/upload"); 

router.post("/create", upload.single("image"), controller.createCareerProfessional);
router.get("/get-all", controller.getAllCareerProfessionals);
router.get("/get-by-id/:id", controller.getCareerProfessionalById);
router.put("/update/:id", upload.single("image"), controller.updateCareerProfessional);
router.delete("/delete/:id", controller.deleteCareerProfessional);

module.exports = router;