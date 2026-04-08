const LogoType = require("../models/logoTypeModel");

/* ================= CREATE ================= */
exports.createLogoType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!["logo", "banner"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'logo' or 'banner'",
      });
    }

    const data = await LogoType.create({ type });

    res.status(201).json({
      success: true,
      message: "Logo type created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllLogoTypes = async (req, res) => {
  try {
    const data = await LogoType.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BY ID ================= */
exports.getLogoTypeById = async (req, res) => {
  try {
    const data = await LogoType.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateLogoType = async (req, res) => {
  try {
    const { type } = req.body;

    if (!["logo", "banner"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'logo' or 'banner'",
      });
    }

    const data = await LogoType.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    await data.update({ type });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteLogoType = async (req, res) => {
  try {
    const data = await LogoType.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    await data.destroy();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};