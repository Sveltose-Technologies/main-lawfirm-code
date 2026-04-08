const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createProfessionals,
  getAllProfessionals,
  getProfessionalsById,
  updateProfessionals,
  deleteProfessionals,
} = require("../controllers/professionals.controller");

router.post("/create", upload.single("bannerImage"), createProfessionals);
router.get("/get-all", getAllProfessionals);
router.get("/get-by-id/:id", getProfessionalsById);
router.put("/update/:id", upload.single("bannerImage"), updateProfessionals);
router.delete("/delete/:id", deleteProfessionals);

module.exports = router;
