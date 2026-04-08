const express = require("express");
const router = express.Router();
const controller = require("../controllers/attorneyConversationController");
const upload = require("../middleware/upload");

const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "attachment", maxCount: 1 },
]);

// create message
router.post("/send", cpUpload, controller.createAttorneyConversation);

// get chat between admin & attorney
router.get("/get/:adminId/:attorneyId", controller.getConversationBetweenUsers);

// get by admin
router.get("/admin/:adminId", controller.getConversationByAdminId);

// get by attorney
router.get("/attorney/:attorneyId", controller.getConversationByAttorneyId);

// router.get("/client/:clientId", controller.getConversationByClientId);

// get by id
router.get("/get-by-id/:id", controller.getConversationById);

// delete
router.delete("/delete/:id", controller.deleteConversation);

router.get("/get-all", controller.getAllConversations);


module.exports = router;