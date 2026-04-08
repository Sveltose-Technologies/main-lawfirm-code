const CareerProfessional = require("../models/careerProfessionalModel");

exports.createCareerProfessional = async (req, res) => {
  try {
    const { categoryId, countryId, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const careerProfessional = await CareerProfessional.create({
      image,
      categoryId,
      countryId,
      content,
    });
    res.status(201).json(careerProfessional);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCareerProfessionals = async (req, res) => {
  try {
    const careerProfessionals = await CareerProfessional.findAll({
      order: [["createdAt", "DESC"]],
    });

    res
      .status(200)
      .json({
        message: "Career Professionals fetched successfully",
        count: careerProfessionals.length,
        data: careerProfessionals,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCareerProfessionalById = async (req, res) => {
  try {
    const { id } = req.params;
    const careerProfessional = await CareerProfessional.findByPk(id);

    if (!careerProfessional) {
      return res.status(404).json({ message: "Career Professional not found" });
    }
    res.status(200).json(careerProfessional);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCareerProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const careerProfessionalToUpdate = await CareerProfessional.findByPk(id);
    if (!careerProfessionalToUpdate) {
      return res.status(404).json({ message: "Career Professional not found" });
    }
    const { categoryId, countryId, content } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    await careerProfessionalToUpdate.update({
      image,
      categoryId,
      countryId,
      content,
    });
    res
      .status(200)
      .json({
        message: "Career Professional updated successfully",
        data: careerProfessionalToUpdate,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCareerProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const careerProfessionalToDelete = await CareerProfessional.findByPk(id);
    if (!careerProfessionalToDelete) {
      return res.status(404).json({ message: "Career Professional not found" });
    }
    await careerProfessionalToDelete.destroy();
    res
      .status(200)
      .json({ message: "Career Professional deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
