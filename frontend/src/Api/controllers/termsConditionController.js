// const TermsCondition = require("../models/termsConditionModel");
const TermsCondition = require("../models/termsConditionModel");

/* ================= CREATE ================= */
exports.createTerms = async (req, res) => {
  try {
    const { adminId, title, content } = req.body;

    const terms = await TermsCondition.create({
      adminId,
      title,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Terms & Conditions created successfully",
      data: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAllTerms = async (req, res) => {
  try {
    const terms = await TermsCondition.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
exports.getTermsById = async (req, res) => {
  try {
    const { id } = req.params;

    const terms = await TermsCondition.findByPk(id);

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "Terms & Conditions not found",
      });
    }

    res.status(200).json({
      success: true,
      data: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateTerms = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const terms = await TermsCondition.findByPk(id);

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "Terms & Conditions not found",
      });
    }

    await terms.update({ title, content });

    res.status(200).json({
      success: true,
      message: "Terms & Conditions updated successfully",
      data: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteTerms = async (req, res) => {
  try {
    const { id } = req.params;

    const terms = await TermsCondition.findByPk(id);

    if (!terms) {
      return res.status(404).json({
        success: false,
        message: "Terms & Conditions not found",
      });
    }

    await terms.destroy();

    res.status(200).json({
      success: true,
      message: "Terms & Conditions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
