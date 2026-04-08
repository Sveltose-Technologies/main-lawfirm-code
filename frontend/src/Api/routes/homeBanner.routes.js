const express = require("express");
const upload = require("../middleware/upload");
const { createHomeBanner, getAllHomeBanners, getHomeBannerById, updateHomeBanner, deleteHomeBanner } = require("../controllers/homeBanner.controller");

const router = express.Router();

// ================= ROUTES =================

// CREATE
router.post("/create", upload.single("image"), createHomeBanner);

// GET ALL
router.get("/get-all", getAllHomeBanners);

// GET BY ID
router.get("/get-by-id/:id", getHomeBannerById);

// UPDATE
router.put("/update/:id", upload.single("image"), updateHomeBanner);

// DELETE
router.delete("/delete/:id", deleteHomeBanner);


module.exports = router;