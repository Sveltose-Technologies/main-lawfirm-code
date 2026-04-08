const express = require("express");
const upload = require("../middleware/upload");
const { createCity, getAllCities,getCityById, updateCity, deleteCity } = require("../controllers/locationCityController");

const router = express.Router();

/* CREATE */
router.post("/create", upload.single("image"), createCity);

/* GET ALL */
router.get("/getall", getAllCities);

// /* GET BY COUNTRY */
// router.get("/by-country/:countryId", getCitiesByCountry);

/* GET BY ID */
router.get("/get/:id", getCityById);

/* UPDATE */
router.put("/update/:id", upload.single("image"), updateCity);

/* DELETE */
router.delete("/delete/:id", deleteCity);

module.exports = router;
