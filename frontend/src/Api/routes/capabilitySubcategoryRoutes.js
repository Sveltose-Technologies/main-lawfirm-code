const express = require("express");
const { createSubcategory, updateSubcategory, deleteSubcategory, getSubcategoriesByCategory } = require("../controllers/capabilitySubcategoryController");
const upload = require("../middleware/upload");

const router = express.Router();

/* 🔐 ADMIN */
router.post(
  "/create",
  upload.single("bannerImage"),
  createSubcategory
);

router.put(
  "/update/:id",
  upload.single("bannerImage"),
  updateSubcategory
);

router.delete(
  "/delete/:id",
  deleteSubcategory
);

/* 👀 PUBLIC / USER */
router.get("/getall-subcategory", getSubcategoriesByCategory);

module.exports = router;
