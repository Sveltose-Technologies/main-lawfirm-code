const Casecategorie = require("../models/casecategorieModel");

/* ================= CREATE ================= */
exports.createCaseCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    // agar JWT middleware use ho raha hai
    const adminId = req.user ? req.user.id : req.body.adminId;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID required" });
    }

    const category = await Casecategorie.create({
      adminId,
      categoryName,
      description,
    });


    res.status(201).json({
      success: true,
      message: "Case category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllCaseCategories = async (req, res) => {
  try {
    const categories = await Casecategorie.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BY ID ================= */
exports.getCaseCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Casecategorie.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateCaseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description } = req.body;

    const category = await Casecategorie.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.update({
      categoryName,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteCaseCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Casecategorie.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
