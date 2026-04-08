const express = require("express");
const router = express.Router();

const lawCareerCategoryController = require("../controllers/lawCareerCategoryController");

// CREATE
router.post("/create", lawCareerCategoryController.create);

// GET ALL
router.get("/getall", lawCareerCategoryController.getAll);

// GET BY ID
router.get("/get-by-id/:id", lawCareerCategoryController.getById);

// UPDATE
router.put("/update/:id", lawCareerCategoryController.update);

// DELETE
router.delete("/delete/:id", lawCareerCategoryController.delete);

module.exports = router;