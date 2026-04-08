const Award = require("../models/awarsModel");

/* ================= CREATE ================= */
exports.createAward = async (req, res) => {
  try {
    const {
      adminId,
      personName,
      organization,
      year,
      awardTitle,
      details
    } = req.body;

const bannerImage = req.files?.bannerImage
  ? `/uploads/${req.files.bannerImage[0].filename}`
  : null;

const peopleImage = req.files?.peopleImage
  ? `/uploads/${req.files.peopleImage[0].filename}`
  : null;

    const award = await Award.create({
      adminId,
      bannerImage,
      peopleImage,
      personName,
      organization,
      year,
      awardTitle,
      details,
    });

    res.status(201).json({
      success: true,
      message: "Award created successfully",
      data: award,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ================= GET ALL ================= */
exports.getAllAwards = async (req, res) => {
  try {
    const awards = await Award.findAll({
      order: [["year", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: awards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
exports.getAwardById = async (req, res) => {
  try {
    const { id } = req.params;

    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    res.status(200).json({
      success: true,
      data: award,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= UPDATE ================= */
exports.updateAward = async (req, res) => {
  try {
    const { id } = req.params;

    const award = await Award.findByPk(id);
    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }
const bannerImage = req.files?.bannerImage
  ? `/uploads/${req.files.bannerImage[0].filename}`
  : award.bannerImage;

const peopleImage = req.files?.peopleImage
  ? `/uploads/${req.files.peopleImage[0].filename}`
  : award.peopleImage;
    await award.update({
      adminId: req.body.adminId || award.adminId,
      bannerImage,
      peopleImage,
      personName: req.body.personName || award.personName,
      organization: req.body.organization || award.organization,
      year: req.body.year || award.year,
      awardTitle: req.body.awardTitle || award.awardTitle,
      details: req.body.details || award.details,
    });

    res.status(200).json({
      success: true,
      message: "Award updated successfully",
      data: award,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteAward = async (req, res) => {
  try {
    const { id } = req.params;

    const award = await Award.findByPk(id);
    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    await award.destroy();

    res.status(200).json({
      success: true,
      message: "Award deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
