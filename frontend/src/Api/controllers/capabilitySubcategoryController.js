const CapabilitySubcategory = require("../models/capabilitySubcategoryModel");

/* ================= CREATE SUBCATEGORY ================= */
exports.createSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryName, description } = req.body;

   const adminId = req.user ? req.user.id : req.body.adminId;
const bannerImage = req.file ? `/uploads/${req.file.filename}` : null;

    const subcategory = await CapabilitySubcategory.create({
      adminId,
      categoryId,
      subcategoryName,
      bannerImage,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: subcategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL BY CATEGORY ================= */
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subcategories = await CapabilitySubcategory.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateSubcategory = async (req, res) => {
  try {
    const subcategory = await CapabilitySubcategory.findByPk(req.params.id);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await subcategory.update({
  subcategoryName: req.body.subcategoryName || subcategory.subcategoryName,
  description: req.body.description || subcategory.description,
  bannerImage: req.file
    ? `/uploads/${req.file.filename}`
    : subcategory.bannerImage,
});

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      data: subcategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await CapabilitySubcategory.findByPk(req.params.id);

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await subcategory.destroy();

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
