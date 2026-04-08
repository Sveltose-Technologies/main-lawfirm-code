const HomeRanking = require("../models/homeRanking.model");

// Create
exports.createHomeRanking = async (req, res) => {
  try {
    const data = await HomeRanking.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All
exports.getHomeRanking = async (req, res) => {
  try {
    const data = await HomeRanking.findAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
exports.updateHomeRanking = async (req, res) => {
  try {
    const { id } = req.params;

    await HomeRanking.update(req.body, { where: { id } });

    res.json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
exports.deleteHomeRanking = async (req, res) => {
  try {
    const { id } = req.params;

    await HomeRanking.destroy({ where: { id } });

    res.json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};