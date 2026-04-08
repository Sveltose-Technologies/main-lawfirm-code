const Blog = require("../models/blogModel");

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, video_url } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

 const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBlog = await Blog.create({
      title,
      image,
      video_url,
    });

    res.status(201).json({
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({ order: [["created_at", "DESC"]] });
    res.status(200).json({message: "All Blogs fetched successfully", count: blogs.length, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const { title, video_url } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

    await blog.update({
      title: title ?? blog.title,
      video_url: video_url ?? blog.video_url,
      image,
    });

    res.status(200).json({ message: "Blog updated successfully", data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.destroy();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
