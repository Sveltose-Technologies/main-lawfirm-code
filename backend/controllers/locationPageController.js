const LocationPage = require("../models/locationPageModel");
// CREATE
exports.createLocationPage = async (req, res) => {
  try {
    const { content } = req.body;

    const bannerImage = req.file ? `/uploads/${req.file.filename}` : null;

    const data = await LocationPage.create({
      bannerImage,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Location page created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// GET ALL
exports.getAllLocationPages = async (req, res) => {
  try {
    const data = await LocationPage.findAll();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// GET BY ID
exports.getLocationPageById = async (req, res) => {
  try {
    const data = await LocationPage.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Location page not found",
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



// UPDATE
exports.updateLocationPage = async (req, res) => {
  try {
    const { content } = req.body;

    const page = await LocationPage.findByPk(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Location page not found",
      });
    }

    const bannerImage = req.file
      ? `/uploads/${req.file.filename}`
      : page.bannerImage;


    await page.update({
      bannerImage,
      content,
    });

    res.json({
      success: true,
      message: "Location page updated successfully",
      data: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// DELETE
exports.deleteLocationPage = async (req, res) => {
  try {
    const page = await LocationPage.findByPk(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Location page not found",
      });
    }

    await page.destroy();

    res.json({
      success: true,
      message: "Location page deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};