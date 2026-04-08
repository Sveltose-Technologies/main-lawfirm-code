const EventBanner = require("../models/eventBannerModel");

// Create
exports.createBanner = async (req, res) => {
  try {
    const { textEditor } = req.body;
    // const bannerImage = req.file ? req.file.path : null;
   const bannerImage = req.file ? `/uploads/${req.file.filename}` : null;
    const data = await EventBanner.create({
      bannerImage,
      textEditor,
    });

    res.json({
      success: true,
      message: "Banner created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All
exports.getAllBanner = async (req, res) => {
  try {
    const data = await EventBanner.findAll({
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get By ID
exports.getBannerById = async (req, res) => {
  try {
    const data = await EventBanner.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.updateBanner = async (req, res) => {
  try {
    const banner = await EventBanner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // const bannerImage = req.file ? req.file.path : banner.bannerImage;
  const bannerImage = req.file
  ? `/uploads/${req.file.filename}`
  : banner.bannerImage;

    await banner.update({
      bannerImage,
      textEditor: req.body.textEditor,
    });

    res.json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await EventBanner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await banner.destroy();

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};