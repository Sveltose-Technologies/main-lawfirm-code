const express = require("express");
const router = express.Router();
const capabilityController = require("../controllers/capability.controller");
const upload = require("../middleware/upload"); // multer middleware

// Create
router.post(
  "/create",
  upload.single("bannerImage"),
  capabilityController.createCapability
);

// Get All
router.get("/getall", capabilityController.getAllCapabilities);

// Get By ID
router.get("/get/:id", capabilityController.getCapabilityById);

// Update
router.put(
  "/update/:id",
  upload.single("bannerImage"),
  capabilityController.updateCapability
);

// Delete
router.delete("/delete/:id", capabilityController.deleteCapability);

module.exports = router;
