const ContactText = require("../models/contactTextModel");

// CREATE
exports.createContactText = async (req, res) => {
  try {
    const { contactText } = req.body;

    const data = await ContactText.create({ contactText });

    res.status(201).json({
      success: true,
      message: "Contact text created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL
exports.getAllContactText = async (req, res) => {
  try {
    const data = await ContactText.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET BY ID
exports.getContactTextById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ContactText.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Contact text not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE
exports.updateContactText = async (req, res) => {
  try {
    const { id } = req.params;
    const { contactText } = req.body;

    const data = await ContactText.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Contact text not found",
      });
    }

    await data.update({ contactText });

    res.status(200).json({
      success: true,
      message: "Contact text updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE
exports.deleteContactText = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ContactText.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Contact text not found",
      });
    }

    await data.destroy();

    res.status(200).json({
      success: true,
      message: "Contact text deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};