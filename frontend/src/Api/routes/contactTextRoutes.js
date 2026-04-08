const express = require("express");
const router = express.Router();

const contactTextController = require("../controllers/contactText.controller");

router.post("/create", contactTextController.createContactText);
router.get("/get-all", contactTextController.getAllContactText);
router.get("/get/:id", contactTextController.getContactTextById);
router.put("/update/:id", contactTextController.updateContactText);
router.delete("/delete/:id", contactTextController.deleteContactText);

module.exports = router;