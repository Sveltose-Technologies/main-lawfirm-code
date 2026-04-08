const express = require("express");
const router = express.Router();

const languageController = require("../controllers/language.controller");

router.get("/get-all", languageController.getAllLanguages);

module.exports = router;