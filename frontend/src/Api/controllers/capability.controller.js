const Capability = require("../models/capability.model");

// ================= CREATE =================
exports.createCapability = async (req, res) => {
  try {
    const { textEditor } = req.body;

    if (!textEditor) {
      return res.status(400).json({
        status: false,
        message: "textEditor is required",
      });
    }

    const bannerImage = req.file ? `/uploads/${req.file.filename}` : null;

    const capability = await Capability.create({
      bannerImage,
      textEditor,
    });

    res.status(201).json({
      status: true,
      message: "Capability created successfully",
      data: capability,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= GET ALL =================
exports.getAllCapabilities = async (req, res) => {
  try {
    const capabilities = await Capability.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: true,
      count: capabilities.length,
      data: capabilities,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= GET BY ID =================
exports.getCapabilityById = async (req, res) => {
  try {
    const capability = await Capability.findByPk(req.params.id);

    if (!capability) {
      return res.status(404).json({
        status: false,
        message: "Capability not found",
      });
    }

    res.status(200).json({
      status: true,
      data: capability,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= UPDATE =================
exports.updateCapability = async (req, res) => {
  try {
    const capability = await Capability.findByPk(req.params.id);

    if (!capability) {
      return res.status(404).json({
        status: false,
        message: "Capability not found",
      });
    }

    const bannerImage = req.file
      ? `/uploads/${req.file.filename}`
      : capability.bannerImage;

    await capability.update({
      bannerImage,
      textEditor: req.body.textEditor || capability.textEditor,
    });

    res.status(200).json({
      status: true,
      message: "Capability updated successfully",
      data: capability,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= DELETE =================
exports.deleteCapability = async (req, res) => {
  try {
    const capability = await Capability.findByPk(req.params.id);

    if (!capability) {
      return res.status(404).json({
        status: false,
        message: "Capability not found",
      });
    }

    await capability.destroy();

    res.status(200).json({
      status: true,
      message: "Capability deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
