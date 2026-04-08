const express = require("express");
const { createContent, getAllContents, getContentById, updateContent, deleteContent } = require("../controllers/cmscategoriesContoller");

const router = express.Router();

/* CREATE */
router.post("/create", createContent);

/* GET ALL */
router.get("/getall", getAllContents);

/* GET BY ID */
router.get("/get/:id", getContentById);

/* UPDATE */
router.put("/update/:id", updateContent);

/* DELETE */
router.delete("/delete/:id", deleteContent);

module.exports = router;
