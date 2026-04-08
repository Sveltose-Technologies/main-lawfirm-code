const express = require("express");
const { createEvent, updateEvent, deleteEvent, getAllEvents, getEventById } = require("../controllers/eventController");
const upload = require("../middleware/upload");
// const { uploader } = require("../services/cloudinary");
// const upload = require("../middleware/upload");
const router = express.Router();

router.post("/create",upload.single("bannerImage") ,createEvent);
router.put("/update/:id", upload.single("bannerImage"), updateEvent);
router.delete("/delete/:id", deleteEvent);
router.get("/getall", getAllEvents);
router.get("/get/:id", getEventById);

module.exports = router;
