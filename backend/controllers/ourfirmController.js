const OurFirm = require("../models/ourFirmModel");


/* ================= CREATE ================= */
exports.createOurFirm = async (req, res) => {
  try {
    const {
      adminId,
      innovationContent,
      peopleContent,
      historyContent,
    } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "adminId is required",
      });
    }

const data = {
  adminId,
  bannerImage: req.files?.bannerImage
    ? `/uploads/${req.files.bannerImage[0].filename}`
    : null,

  innovationContent,
  innovationImage: req.files?.innovationImage
    ? `/uploads/${req.files.innovationImage[0].filename}`
    : null,

  peopleContent,
  peopleImage: req.files?.peopleImage
    ? `/uploads/${req.files.peopleImage[0].filename}`
    : null,

  historyContent,
  historyImage: req.files?.historyImage
    ? `/uploads/${req.files.historyImage[0].filename}`
    : null,
};

    const result = await OurFirm.create(data);

    res.status(201).json({
      success: true,
      message: "Our Firm created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
exports.getAllOurFirm = async (req, res) => {
  try {
    const result = await OurFirm.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
exports.getOurFirmById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await OurFirm.findByPk(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Our Firm record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateOurFirm = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await OurFirm.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Our Firm record not found",
      });
    }

    const updatedData = {
      adminId: req.body.adminId || record.adminId,
      bannerImage:
        req.files?.bannerImage?.[0]?.filename || null,

      innovationContent:
        req.body.innovationContent || record.innovationContent,
      innovationImage:
        req.files?.innovationImage?.[0]?.filename || null,

      peopleContent:
        req.body.peopleContent || record.peopleContent,
      peopleImage:
        req.files?.peopleImage?.[0]?.filename || null,

      historyContent:
        req.body.historyContent || record.historyContent,
      historyImage:
        req.files?.historyImage?.[0]?.filename || null,
    };

    await record.update(updatedData);

    res.status(200).json({
      success: true,
      message: "Our Firm updated successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
exports.deleteOurFirm = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await OurFirm.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Our Firm record not found",
      });
    }

    await record.destroy();

    res.status(200).json({
      success: true,
      message: "Our Firm deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
