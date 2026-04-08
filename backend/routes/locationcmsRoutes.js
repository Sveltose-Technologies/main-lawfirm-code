const express = require("express");
const { createContent, getAllContent, getContentById, updateContent, deleteContent } = require("../controllers/locationcmsController");
const router = express.Router();

router.post("/create", createContent);
router.get("/getall",getAllContent);
router.get("/get/:id", getContentById);
router.put("/update/:id", updateContent);
router.delete("/delete/:id", deleteContent);

module.exports = router;
