const Career = require("../models/careerModel");

/* ================= CREATE ================= */
exports.createCareer = async (req, res) => {
  try {
    const data = await Career.create({
      ...req.body,
    });

    res.status(201).json({
      status: true,
      message: "Career created successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


/* ================= GET ALL ================= */
exports.getAllCareers = async (req, res) => {
  try {
    const data = await Career.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      status: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


/* ================= GET BY ID ================= */
exports.getCareerById = async (req, res) => {
  try {
    const data = await Career.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Career not found",
      });
    }

    res.status(200).json({
      status: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


/* ================= UPDATE ================= */
exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        status: false,
        message: "Career not found",
      });
    }

    await career.update({
      ...req.body,
    });

    res.status(200).json({
      status: true,
      message: "Career updated successfully",
      data: career,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};


/* ================= DELETE ================= */
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByPk(req.params.id);

    if (!career) {
      return res.status(404).json({
        status: false,
        message: "Career not found",
      });
    }

    await career.destroy();

    res.status(200).json({
      status: true,
      message: "Career deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};