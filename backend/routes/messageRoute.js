const router = require("express").Router();
const Message = require("../models/messageModel");

router.get("/:conversationId", async (req, res) => {
  const messages = await Message.findAll({
    conversationId: req.params.conversationId,
  }).sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;