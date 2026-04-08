const express = require("express");
const upload = require("../middleware/upload");
const { createPromoter, getAllPromoters, getPromoterById, updatePromoter, deletePromoter } = require("../controllers/promotorsController");

const router = express.Router();

router.post("/create", upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "personImage", maxCount: 1 }
]), createPromoter);

router.get("/getall", getAllPromoters);
router.get("/get/:id", getPromoterById);
router.put("/update/:id", upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "personImage", maxCount: 1 }
]), updatePromoter);

router.delete("/delete/:id", deletePromoter);

module.exports = router;
