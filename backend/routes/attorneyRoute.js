const express = require("express");
const upload = require("../middleware/upload");
const { attorneySignup, attorneyLogin, forgotPassword, verifyOtp, resetPassword, getAllAttorneys, updateAttorneyProfile, deleteAttorney, getAttorneyById, getAllAdmission, getAllEducation } = require("../controllers/attorneyController");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();

const cpUpload = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "kycIdentity", maxCount: 1 },
  { name: "kycAddress", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "barCouncilIndiaId", maxCount: 1 },
  { name: "barCouncilStateId", maxCount: 1 },
]);

/* ================= AUTH ROUTES ================= */

// Client Signup
router.post("/signup", attorneySignup);

// Client Login
router.post("/login", attorneyLogin);

// Forgot Password (Send OTP)
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.put("/reset-password", resetPassword);

/* ================= CLIENT PROFILE ROUTES ================= */

// Get All Clients (Admin Only)
router.get("/getall",  getAllAttorneys);

// Update Client Profile
router.put(
  "/update/:id",cpUpload , updateAttorneyProfile
);

// Delete Client (Admin Only)
router.delete("/delete/:id", adminOnly, deleteAttorney);

router.get("/get-by-id/:id",  getAttorneyById);

router.get("/getall-admission",  getAllAdmission);
router.get("/getall-education",  getAllEducation);


module.exports = router;
