const express = require("express");
const { createServices, getAllContent, getContentByid, updateContent, deleteContent } = require("../controllers/servicesController");

const router = express.Router();

router.post("/create", createServices );
router.get("/get-all", getAllContent);
router.get("/get-by-id/:id", getContentByid);
router.put("/update/:id", updateContent);
router.delete("/delete/:id", deleteContent);

module.exports = router