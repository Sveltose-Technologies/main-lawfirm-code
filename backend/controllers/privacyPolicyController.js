const PrivacyPolicy = require("../models/privacyPolicyModel");

/* ================= CREATE ================= */
exports.createPrivacyPolicy = async (req, res) => {
  try {
    const { adminId, title, content } = req.body;

    const policy = await PrivacyPolicy.create({
      adminId,
      title,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Privacy Policy created successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: policies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
exports.getPrivacyPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await PrivacyPolicy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy Policy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const policy = await PrivacyPolicy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy Policy not found",
      });
    }

    await policy.update({ title, content });

    res.status(200).json({
      success: true,
      message: "Privacy Policy updated successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await PrivacyPolicy.findByPk(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Privacy Policy not found",
      });
    }

    await policy.destroy();

    res.status(200).json({
      success: true,
      message: "Privacy Policy deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
