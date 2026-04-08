const express = require("express");
const { createEnquiry, getAllEnquiries, getEnquiryById, deleteEnquiry, updateEnquiry } = require("../controllers/contactUsController");


const router = express.Router();

// Create a new enquiry
router.post("/create", createEnquiry);

// Get all enquiries
router.get("/getall", getAllEnquiries);

// Get a single enquiry by ID
router.get("/get/:id", getEnquiryById);

// Update enquiry
router.put("/update/:id", updateEnquiry)

// Delete an enquiry
router.delete("/delete/:id", deleteEnquiry);

module.exports = router;
