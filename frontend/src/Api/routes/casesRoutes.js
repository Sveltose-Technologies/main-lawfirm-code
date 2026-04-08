const express = require("express");
const { createCaseCategory, getAllCaseCategories, getCaseCategoryById, updateCaseCategory, deleteCaseCategory } = require("../controllers/caseCategoriesController.js");
// const { adminOnly } = require("../middleware/auth");
const router = express.Router();

// const {
//   createCaseCategory,
//   getAllCaseCategories,
//   getCaseCategoryById,
//   updateCaseCategory,
//   deleteCaseCategory,
// } = require("../controllers/caseCategoryController");


/* CREATE */
router.post("/create", createCaseCategory);

/* GET ALL */
router.get("/get-all", getAllCaseCategories);

/* GET ONE */
router.get("/get/:id", getCaseCategoryById);

/* UPDATE */
router.put("/update/:id", updateCaseCategory);

/* DELETE */
router.delete("/delete/:id",deleteCaseCategory);

module.exports = router;
