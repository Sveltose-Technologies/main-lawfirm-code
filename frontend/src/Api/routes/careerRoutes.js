const express = require("express");
const router = express.Router();

const controller = require("../controllers/careerController");

// CREATE
router.post("/create", controller.createCareer);

// GET ALL
router.get("/get-all", controller.getAllCareers);

// GET BY ID
router.get("/get-by-id/:id", controller.getCareerById);

// UPDATE
router.put("/update/:id", controller.updateCareer);

// DELETE
router.delete("/delete/:id", controller.deleteCareer);

module.exports = router;