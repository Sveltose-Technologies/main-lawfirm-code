const LocationContent = require("../models/locationcmsModel");


/* ================= CREATE ================= */
exports.createContent = async (req, res) => {
  try {
    const { adminId, countryId, cityId, content } = req.body;

    if (!adminId || !countryId || !cityId || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const data = await LocationContent.create({
      adminId,
      countryId,
      cityId,
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
    const data = await LocationContent.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BY ID ================= */
exports.getContentById = async (req, res) => {
  try {
    const data = await LocationContent.findByPk(req.params.id);

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
    const { adminId, countryId, cityId, content } = req.body;

    const data = await LocationContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    await data.update({
      adminId,
      countryId,
      cityId,
      content,
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
    const data = await LocationContent.findByPk(req.params.id);

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
