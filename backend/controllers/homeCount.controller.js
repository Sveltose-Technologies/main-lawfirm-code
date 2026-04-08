const HomeCount = require("../models/homeCountModel");

// Create
exports.createHomeCount = async (req, res) => {
  try {
    const data = await HomeCount.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All
exports.getHomeCount = async (req, res) => {
  try {
    const data = await HomeCount.findAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
exports.updateHomeCount = async (req, res) => {
  try {
    const { id } = req.params;

    await HomeCount.update(req.body, { where: { id } });

    res.json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
exports.deleteHomeCount = async (req, res) => {
  try {
    const { id } = req.params;

    await HomeCount.destroy({ where: { id } });

    res.json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};