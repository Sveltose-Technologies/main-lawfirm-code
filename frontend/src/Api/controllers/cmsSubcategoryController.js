const CapabilityContent = require("../models/cmsSubcategoriesModel");

/* ================= CREATE ================= */
exports.createContent = async (req, res) => {
  try {
    const { adminId, categoryId, subcategoryId, content } = req.body;

    const data = await CapabilityContent.create({
      adminId,
      categoryId,
      subcategoryId,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllContent = async (req, res) => {
  try {
    const data = await CapabilityContent.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BY ID ================= */
exports.getContentById = async (req, res) => {
  try {
    const data = await CapabilityContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateContent = async (req, res) => {
  try {
    const data = await CapabilityContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Content not found" });
    }

    await data.update(req.body);

    res.json({
      success: true,
      message: "Content updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteContent = async (req, res) => {
  try {
    const data = await CapabilityContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Content not found" });
    }

    await data.destroy();

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
