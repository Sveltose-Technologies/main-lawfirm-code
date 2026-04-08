const AttorneyConversation = require("../models/attorneyConversationModel");

exports.createAttorneyConversation = async (req, res) => {
  try {
    const { adminId, attorneyId, senderType, message } = req.body;

    if (!adminId || !attorneyId || !senderType ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    if (!["admin", "attorney"].includes(senderType)) {
      return res.status(400).json({
        status: false,
        message: "senderType must be admin or attorney",
      });
    }

     const image = req.files?.image
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    const attachment = req.files?.attachment
      ? `/uploads/${req.files.attachment[0].filename}`
      : null;

    const chat = await AttorneyConversation.create({
      adminId,
      attorneyId,
      senderType,
      message,
      image,
      attachment,
    });

    res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: chat,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getConversationBetweenUsers = async (req, res) => {
  try {
    const { adminId, attorneyId } = req.params;

    const chats = await AttorneyConversation.findAll({
      where: { adminId, attorneyId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      status: true,
      total: chats.length,
      data: chats,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};

exports.getConversationByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    const chats = await AttorneyConversation.findAll({
      where: { adminId },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      status: true,
      data: chats,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error" });
  }
};

exports.getConversationByAttorneyId = async (req, res) => {
  try {
    const { attorneyId } = req.params;

    const chats = await AttorneyConversation.findAll({
      where: { attorneyId },
      order: [["createdAt", "ASC"]],
    });

    res.json({
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

    const deleted = await AttorneyConversation.destroy({
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

    const chat = await AttorneyConversation.findByPk(id);

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

exports.getAllConversations = async (req, res) => {
  try {
       const chats = await AttorneyConversation.findAll({
      order: [["createdAt", "ASC"]],
    });

    const grouped = {};

    chats.forEach((chat) => {
      const key = `${chat.adminId}_${chat.attorneyId}`;

      if (!grouped[key]) {
        grouped[key] = {
          adminId: chat.adminId,
          attorneyId: chat.attorneyId,
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

// exports.getAllConversations = async (req, res) => {
//   try {
//     const chats = await AttorneyConversation.findAll({
//       order: [["createdAt", "DESC"]],
//     });

//     res.status(200).json({
//       status: true,
//       total: chats.length,
//       data: chats,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Server error",
//     });
//   }
// };