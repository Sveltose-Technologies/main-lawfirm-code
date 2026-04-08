const Blogcategory = require("../models/blogcategoriesModel");


// ➕ Create Blog Category
exports.createBlog = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName || !description) {
      return res.status(400).json({
        message: "categoryName and description are required",
      });
    }

    const existingCategory = await Blogcategory.findOne({
      where: { categoryName },
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    const category = await Blogcategory.create({
      categoryName,
      description,
    });

    res.status(201).json({
      message: "Blog category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // 📄 Get All Blog Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Blogcategory.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({message: "All Blogs categories fetched successfully",count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // 📄 Get Category By ID
// exports.getCategoryById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const category = await BlogCategory.findByPk(id);
//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.status(200).json(category);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update Blog Category
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description } = req.body;

    const category = await Blogcategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.update({
      categoryName,
      description,
    });

    res.status(200).json({
      message: "Blog category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//  Delete Blog Category
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Blogcategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: " Blog not found" });
    }

    await category.destroy();

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
