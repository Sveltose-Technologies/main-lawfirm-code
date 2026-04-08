const express = require("express");

const upload = require("../middleware/upload");
const { updateAdminProfile,getAdminupdate, adminSignup, adminLogin, forgotPassword, verifyOtp, resetPassword, deleteAdmin } = require("../controllers/adminConteoller");

const router = express.Router();

router.post("/signup",adminSignup)
router.post("/login",adminLogin)

router.put(
  "/update/:id",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "websiteLogo", maxCount: 1 },
  ]),
  updateAdminProfile
);

router.get("/getall-adminprofile",getAdminupdate)
router.delete("/delete/:id", deleteAdmin)

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.put("/reset-password", resetPassword);

module.exports = router;
