const Professionals = require("../models/professionals.model");

// ================= CREATE =================
exports.createProfessionals = async (req, res) => {
  try {
    const { textEditor } = req.body;

    if (!textEditor) {
      return res.status(400).json({
        status: false,
        message: "textEditor field is required",
      });
    }

    const bannerImage = req.file ? `/uploads/${req.file.filename}` : null;

    const data = await Professionals.create({
      bannerImage,
      textEditor,
    });

    res.status(201).json({
      status: true,
      message: "Professionals page created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
exports.getAllProfessionals = async (req, res) => {
  try {
    const data = await Professionals.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= GET BY ID =================
exports.getProfessionalsById = async (req, res) => {
  try {
    const data = await Professionals.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= UPDATE =================
exports.updateProfessionals = async (req, res) => {
  try {
    const { textEditor } = req.body;

    const data = await Professionals.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }

     let bannerImage = data.bannerImage;

    if (req.file) {
      bannerImage = `/uploads/${req.file.filename}`;
    }


    await data.update({
      bannerImage,
      textEditor: textEditor || data.textEditor,
    });

    res.status(200).json({
      status: true,
      message: "Updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= DELETE =================
exports.deleteProfessionals = async (req, res) => {
  try {
    const data = await Professionals.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }

    await data.destroy();

    res.status(200).json({
      status: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
