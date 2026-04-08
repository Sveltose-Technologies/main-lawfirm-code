const express = require("express");
const router = express.Router();
const { createOurFirm, getAllOurFirm, getOurFirmById, updateOurFirm, deleteOurFirm } = require("../controllers/ourfirmController");
const upload = require("../middleware/upload");

/* ---------- FILE UPLOAD CONFIG ---------- */
const cpUpload = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "innovationImage", maxCount: 1 },
  { name: "peopleImage", maxCount: 1 },
  { name: "historyImage", maxCount: 1 },
]);

/* ---------- ROUTES ---------- */
router.post("/create", cpUpload, createOurFirm);
router.get("/getall", getAllOurFirm);
router.get("/get/:id", getOurFirmById);
router.put("/update/:id", cpUpload, updateOurFirm);
router.delete("/delete/:id", deleteOurFirm);

module.exports = router;
