const CapabilityContent = require("../models/cmscategoriesModel");


/* ================= CREATE ================= */
exports.createContent = async (req, res) => {
  try {
    const { adminId, categoryId, subcategoryIds, content } = req.body;

    if (!adminId || !categoryId || !subcategoryIds || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const data = await CapabilityContent.create({
      adminId,
      categoryId,
      subcategoryIds, 
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
exports.getAllContents = async (req, res) => {
  try {
    const data = await CapabilityContent.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BY ID ================= */
exports.getContentById = async (req, res) => {
  try {
    const data = await CapabilityContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateContent = async (req, res) => {
  try {
    const data = await CapabilityContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const { categoryId, subcategoryIds, content } = req.body;

    await data.update({
      categoryId: categoryId ?? data.categoryId,
      subcategoryIds: subcategoryIds ?? data.subcategoryIds,
      content: content ?? data.content,
    });

    res.status(200).json({
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
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    await data.destroy();

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
