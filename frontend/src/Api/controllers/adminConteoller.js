const bcrypt = require("bcryptjs");
const sendEmail = require("../services/email");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };

const generateToken = (adminId) => {
  return jwt.sign(
    { id: adminId, type: "admin" }, 
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

exports.adminSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNo,
      city,
    } = req.body;

    // 🔹 Required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // 🔹 Name validation
    if (firstName.length < 2 || firstName.length > 50) {
      return res
        .status(400)
        .json({ message: "First name must be 2-50 characters" });
    }

    if (lastName.length < 2 || lastName.length > 50) {
      return res
        .status(400)
        .json({ message: "Last name must be 2-50 characters" });
    }

    // 🔹 Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 🔹 Password validation
    if (password.length < 6 || password.length > 20) {
      return res
        .status(400)
        .json({ message: "Password must be 6-20 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 🔹 Check existing admin
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      city,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNo: admin.phoneNo,
        city: admin.city,
        role: admin.role,
        token: generateToken(admin.id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 🔹 Find admin
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // 🔹 Password check
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNo: admin.phoneNo,
        city: admin.city,
        token: generateToken(admin.id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


exports.updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params; 

    const {
      firstName,
      lastName,
      email,
      phoneNo,
      city,
      password,
      confirmPassword,
    } = req.body;

    // 🔹 Find admin
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 🔹 Password handling
    let hashedPassword = admin.password;
    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        return res.status(400).json({
          message: "Password and confirm password are required",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Password and confirm password do not match",
        });
      }

      hashedPassword = await bcrypt.hash(password, 10);
    }

    // 🔹 File handling
   const profileImage = req.files?.profileImage
  ? `/uploads/${req.files.profileImage[0].filename}`
  : admin.profileImage;

const websiteLogo = req.files?.websiteLogo
  ? `/uploads/${req.files.websiteLogo[0].filename}`
  : admin.websiteLogo;

    // 🔹 Update admin profile (partial update)
    await admin.update({
      firstName: firstName ?? admin.firstName,
      lastName: lastName ?? admin.lastName,
      email: email ?? admin.email,
      phoneNo: phoneNo ?? admin.phoneNo,
      city: city ?? admin.city,
      password: hashedPassword,
      profileImage,
      websiteLogo,
    });

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



exports.getAdminupdate = async (req, res) => {
  try {
    const settings = await Admin.findOne();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAdmin = async(req, res) => {
 try {
        const {id} = req.params;
  const admin= Admin.findByPk(id)   
    if (!admin){
       return res.status(404).json({message: "admin not found"})
    }

    await admin.destroy();
    res.status(200).json({
      message: "Admin Deleted Successfully"
    })
} catch (error) {
   console.log(error)
    res.status(500).json({message: " Server Error",  error: error.message })
}
    
}


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "admin not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOtp = otp;
    admin.resetOtpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 min
    admin.resetOtpVerified = false; // reset verification flag
    await admin.save();

    // Send OTP by email
    await sendEmail(`${admin.firstName} ${admin.lastName}`, email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Step 2: Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email & OTP required" });

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "admin not found" });

    // Check OTP match and expiry
    if (admin.resetOtp !== otp ) return res.status(400).json({ message: "Invalid OTP" });
    if (admin.resetOtpExpire < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // Mark OTP as verified
    admin.resetOtpVerified = true;
    await admin.save(); 

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Step 3: Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email,newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "Email, new password & confirm password required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "admin not found" });

    // Check if OTP was verified
    if (!admin.resetOtpVerified)
      return res.status(400).json({ message: "OTP not verified yet" });

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;

    // Clear OTP fields
    admin.resetOtp = null;
    admin.resetOtpExpire = null;
    admin.resetOtpVerified = false;

    await admin.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};





