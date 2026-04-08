const express = require("express");
const upload = require("../middleware/upload");
const { createAward, getAllAwards, getAwardById, updateAward, deleteAward } = require("../controllers/awardsController");

const router = express.Router();
const cpUpload = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "peopleImage", maxCount: 1 }
]);

router.post("/create", cpUpload, createAward);
router.get("/getall", getAllAwards);
router.get("/get/:id", getAwardById);
router.put("/update/:id", cpUpload, updateAward);
router.delete("/delete/:id", deleteAward);

module.exports = router;
