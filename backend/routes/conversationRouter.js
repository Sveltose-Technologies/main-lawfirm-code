const router = require("express").Router();
const Conversation = require("../models/conversationModel");

router.post("/create", async (req, res) => {
  const { user1, user2 } = req.body;

  let convo = await Conversation.findOne({
    participants: {
      $all: [
        { $elemMatch: { userId: user1 } },
        { $elemMatch: { userId: user2 } },
      ],
    },
  });

  if (!convo) {
    convo = await Conversation.create({
      participants: [
        { userId: user1 },
        { userId: user2 },
      ],
    });
  }

  res.json(convo);
});

module.exports = router;