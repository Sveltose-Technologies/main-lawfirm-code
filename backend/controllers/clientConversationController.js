const ClientConversation = require("../models/clientConversationModel");

exports.createClientConversation = async (req, res) => {
  try {
    const { adminId, clientId, senderType, message } = req.body;

    if (!adminId || !clientId || !senderType || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    if (!["admin", "client"].includes(senderType)) {
      return res.status(400).json({
        status: false,
        message: "senderType must be admin or client",
      });
    }

    const image = req.files?.image
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    const attachment = req.files?.attachment
      ? `/uploads/${req.files.attachment[0].filename}`
      : null;

    const conversation = await ClientConversation.create({
      adminId,
      clientId,
      senderType,
      image,
      attachment,
      message,
    });

    res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: conversation,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    const chats = await ClientConversation.findAll({
      order: [["createdAt", "ASC"]],
    });

    const grouped = {};

    chats.forEach((chat) => {
      const key = `${chat.adminId}_${chat.clientId}`;

      if (!grouped[key]) {
        grouped[key] = {
          adminId: chat.adminId,
          clientId: chat.clientId,
          messages: [],
        };
      }

      grouped[key].messages.push({
        id: chat._id,
        senderType: chat.senderType,
        message: chat.message,
        image: chat.image,
        attachment: chat.attachment,
        createdAt: chat.createdAt,
      });
    });

    res.status(200).json({
      status: true,
      total: Object.keys(grouped).length,
      data: Object.values(grouped),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
exports.getConversationBetweenUsers = async (req, res) => {
  try {
    const { adminId, clientId } = req.params;

    const chats = await ClientConversation.findAll({
      where: { adminId, clientId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      status: true,
      total: chats.length,
      data: chats,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.getConversationByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    const chats = await ClientConversation.findAll({
      where: { adminId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      status: true,
      data: chats,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};

exports.getConversationByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const chats = await ClientConversation.findAll({
      where: { clientId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      status: true,
      data: chats,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ClientConversation.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Not found",
      });
    }

    res.json({
      status: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};

exports.getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await ClientConversation.findByPk(id);

    if (!chat) {
      return res.status(404).json({
        status: false,
        message: "Not found",
      });
    }

    res.json({
      status: true,
      data: chat,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};