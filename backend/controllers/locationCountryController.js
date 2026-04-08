const CountryContent = require("../models/locationCountryModel");


/* ================= CREATE ================= */
exports.createCountryContent = async (req, res) => {
  try {
    const { adminId, countryName, content } = req.body;

    if (!adminId || !countryName || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const data = await CountryContent.create({
      adminId,
      countryName,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Country content created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllCountryContent = async (req, res) => {
  try {
    const data = await CountryContent.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET BY ID ================= */
exports.getCountryContentById = async (req, res) => {
  try {
    const data = await CountryContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateCountryContent = async (req, res) => {
  try {
    const data = await CountryContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    await data.update({
      countryName: req.body.countryName,
      content: req.body.content,
    });

    res.status(200).json({
      success: true,
      message: "Country content updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ================= */
exports.deleteCountryContent = async (req, res) => {
  try {
    const data = await CountryContent.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    await data.destroy();

    res.status(200).json({
      success: true,
      message: "Country content deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
