const SocialMedia = require("../models/socialMediaModel");

/* ================= CREATE ================= */
exports.createSocialMedia = async (req, res) => {
  try {
    const { facebookUrl, twitterUrl, instagramUrl, linkedinUrl } = req.body;

    const socialMedia = await SocialMedia.create({
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
    });

    res.status(201).json({
      success: true,
      message: "Social media created successfully",
      data: socialMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAllSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
exports.getSocialMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await SocialMedia.findByPk(id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media not found",
      });
    }

    res.status(200).json({
      success: true,
      data: socialMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { facebookUrl, twitterUrl, instagramUrl, linkedinUrl } = req.body;

    const socialMedia = await SocialMedia.findByPk(id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media not found",
      });
    }

    await socialMedia.update({
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
    });

    res.status(200).json({
      success: true,
      message: "Social media updated successfully",
      data: socialMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMedia = await SocialMedia.findByPk(id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media not found",
      });
    }

    await socialMedia.destroy();

    res.status(200).json({
      success: true,
      message: "Social media deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
