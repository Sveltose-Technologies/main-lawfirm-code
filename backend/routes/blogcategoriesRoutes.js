const express = require("express");
const router = express.Router();
const {createBlog, updateBlog, deleteBlog, getAllCategories } = require("../controllers/blogCategoriesController");

router.post("/create", createBlog);
router.put("/update/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.get("/getall", getAllCategories);


module.exports = router;
