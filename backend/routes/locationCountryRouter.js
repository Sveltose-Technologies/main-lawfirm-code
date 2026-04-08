const express = require("express");
const { createCountryContent, getAllCountryContent, getCountryContentById, updateCountryContent, deleteCountryContent } = require("../controllers/locationCountryController");
// const {
//   createCountryContent,
//   getAllCountryContent,
//   getCountryContentById,
//   updateCountryContent,
//   deleteCountryContent,
// } = require("../controllers/countryContentController");

const router = express.Router();

/* CREATE */
router.post("/create", createCountryContent);

/* GET ALL */
router.get("/getall", getAllCountryContent);

/* GET BY ID */
router.get("/get/:id", getCountryContentById);

/* UPDATE */
router.put("/update/:id", updateCountryContent);

/* DELETE */
router.delete("/delete/:id", deleteCountryContent);

module.exports = router;
