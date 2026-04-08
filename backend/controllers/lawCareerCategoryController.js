const LawCareerCategory = require("../models/lawCareerCategoryModel");

/* CREATE */
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    const data = await LawCareerCategory.create({ name });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL */
exports.getAll = async (req, res) => {
  try {
    const data = await LawCareerCategory.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET BY ID */
exports.getById = async (req, res) => {
  try {
    const data = await LawCareerCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE */
exports.update = async (req, res) => {
  try {
    const data = await LawCareerCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    await data.update({
      name: req.body.name,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE */
exports.delete = async (req, res) => {
  try {
    const data = await LawCareerCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    await data.destroy();

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};