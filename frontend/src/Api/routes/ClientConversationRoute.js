const express = require("express");
const router = express.Router();
const controller = require("../controllers/clientConversationController");
const upload = require("../middleware/upload");

const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "attachment", maxCount: 1 },
]);

router.post("/send" ,cpUpload, controller.createClientConversation);

// important
router.get("/get/:adminId/:clientId", controller.getConversationBetweenUsers);

router.get("/admin/:adminId", controller.getConversationByAdminId);
router.get("/client/:clientId", controller.getConversationByClientId);

router.get("/get-all", controller.getAllConversations);
router.get("/get-by-id/:id", controller.getConversationById);
router.delete("/delete/:id", controller.deleteConversation);

module.exports = router;