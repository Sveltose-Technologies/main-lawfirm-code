const express = require("express");

const router = express.Router();

const {  getAllUsers, getUserById, updateUser, deleteUser, signUpuser, loginUser, forgotPassword, verifyOtp, resetPassword } = require("../controllers/userController");

router.post("/create", signUpuser); 
router.post("/login", loginUser);
router.get("/get-all", getAllUsers);
router.get("/get-by-id/:id", getUserById);  
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
// Forgot Password (Send OTP)
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Reset Password
router.put("/reset-password", resetPassword);

module.exports = router;