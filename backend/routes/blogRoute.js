const express = require("express");
const { createBlog, getAllBlogs, updateBlog, deleteBlog } = require("../controllers/blogContoller");
const upload = require("../middleware/upload");


const router = express.Router();

router.post('/create', upload.single('image'),createBlog );
router.get('/getall', getAllBlogs);
router.put('/update/:id', upload.single('image'),updateBlog);
router.delete('/:id',deleteBlog);

module.exports = router;