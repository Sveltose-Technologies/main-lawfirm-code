const express = require("express");
const upload = require("../middleware/upload");
const { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById } = require("../controllers/capabilitycategoriescontroller");
const router = express.Router();

/* ADMIN ONLY */
router.post(
  "/create",
  upload.single("bannerImage"),
  createCategory
);

router.put(
  "/update/:id",
  upload.single("bannerImage"),
  updateCategory
);

router.delete(
  "/delete/:id",
  deleteCategory
);

/* ALL USERS */
router.get("/get-all", getAllCategories);
router.get("/get/:id", getCategoryById);

module.exports = router;
