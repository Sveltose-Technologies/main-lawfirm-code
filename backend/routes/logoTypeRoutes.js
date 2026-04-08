const express = require("express");
const {
  createLogoType,
  getAllLogoTypes,
  getLogoTypeById,
  updateLogoType,
  deleteLogoType,
} = require("../controllers/logoTypeController");

const router = express.Router();

router.post("/create", createLogoType);
router.get("/get-all", getAllLogoTypes);
router.get("/get/:id", getLogoTypeById);
router.put("/update/:id", updateLogoType);
router.delete("/delete/:id", deleteLogoType);

module.exports = router;