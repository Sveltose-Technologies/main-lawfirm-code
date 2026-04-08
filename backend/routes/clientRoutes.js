const express = require("express");
const router = express.Router();
const { clientsignup, clientlogin, forgotPassword, verifyOtp, resetPassword, getAllClients, updateClientProfile, deleteClient, getClientById } = require("../controllers/clientController");

const upload = require("../middleware/upload");


const cpUpload = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "kycIdentity", maxCount: 1 },
  { name: "kycAddress", maxCount: 1 }
]);

/* ================= AUTH ROUTES ================= */

// Client Signup
router.post("/signup", clientsignup);

// Client Login
router.post("/login", clientlogin);

// Forgot Password (Send OTP)
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.put("/reset-password", resetPassword);

/* ================= CLIENT PROFILE ROUTES ================= */

// Get All Clients (Admin Only)
router.get("/getall", getAllClients);

// Update Client Profile
router.put(
  "/update/:id",cpUpload , updateClientProfile
)

// Delete Client (Admin Only)
router.delete("/delete/:id",  deleteClient);

router.get("/get-by-id/:id", getClientById)

module.exports = router;
