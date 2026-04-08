const AttorneyClientConversation = require("../models/attorney-client-ConversationModel");

//  CREATE MESSAGE
exports.createMessage = async (req, res) => {
  try {
    const { attorneyId, clientId, senderType, message } = req.body;

    if (!attorneyId || !clientId || !senderType || !message) {
      return res.status(400).json({
        status: false,
        message: "All fields required",
      });
    }

    if (!["attorney", "client"].includes(senderType)) {
      return res.status(400).json({
        status: false,
        message: "Invalid senderType",
      });
    }

    const image = req.files?.image
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    const attachment = req.files?.attachment
      ? `/uploads/${req.files.attachment[0].filename}`
      : null;

    const chat = await AttorneyClientConversation.create({
      attorneyId,
      clientId,
      senderType,
      message,
      image,
      attachment,
    });

    res.status(201).json({
      status: true,
      message: "Message sent",
      data: chat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const chats = await AttorneyClientConversation.findAll({
      where: { clientId },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      status: true,
      total: chats.length,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({ status: false });
  }
};

exports.getByAttorneyId = async (req, res) => {
  try {
    const { attorneyId } = req.params;

    const chats = await AttorneyClientConversation.findAll({
      where: { attorneyId },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      status: true,
      total: chats.length,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({ status: false });
  }
};

exports.getChat = async (req, res) => {
  try {
    const { attorneyId, clientId } = req.params;

    const chats = await AttorneyClientConversation.findAll({
      where: { attorneyId, clientId },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      status: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({ status: false });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await AttorneyClientConversation.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Message not found",
      });
    }

    res.json({
      status: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const chats = await AttorneyClientConversation.findAll({
      order: [["createdAt", "ASC"]],
    });

    const grouped = {};

    chats.forEach((chat) => {
      const key = `${chat.attorneyId}_${chat.clientId}`;

      if (!grouped[key]) {
        grouped[key] = {
          attorneyId: chat.attorneyId,
          clientId: chat.clientId,
          messages: [],
        };
      }

      grouped[key].messages.push({
        id: chat.id,
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
      message: "Server error",
    });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await AttorneyClientConversation.findByPk(id);

    if (!chat) {
      return res.status(404).json({
        status: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      status: true,
      data: chat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
