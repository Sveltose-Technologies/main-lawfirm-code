const CareerDetail = require("../models/careerDetailModel");

/* ================= CREATE ================= */
exports.createCareerDetail = async (req, res) => {
  try {
    const { bannerText, description } = req.body;


    const bannerImage = req.files?.bannerImage
  ? `/uploads/${req.files.bannerImage[0].filename}`
  : null;


    const data = await CareerDetail.create({
      bannerText,
      description,
      bannerImage,
    });

    res.status(201).json({
      message: "Career Detail created successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= GET ALL ================= */
exports.getAllCareerDetails = async (req, res) => {
  try {
    const data = await CareerDetail.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({ data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= GET BY ID ================= */
exports.getCareerDetailById = async (req, res) => {
  try {
    const data = await CareerDetail.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= UPDATE ================= */
exports.updateCareerDetail = async (req, res) => {
  try {
    const data = await CareerDetail.findByPk(req.params.id);

    const bannerImage = req.files?.bannerImage
  ? `/uploads/${req.files.bannerImage[0].filename}`
  : null;

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    const { bannerText, description } = req.body;

    await data.update({
      bannerText,
      description,
      bannerImage,
    });

    res.status(200).json({
      message: "Updated successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= DELETE ================= */
exports.deleteCareerDetail = async (req, res) => {
  try {
    const data = await CareerDetail.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    await data.destroy();

    res.status(200).json({
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
