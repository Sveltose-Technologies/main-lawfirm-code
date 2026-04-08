const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sendEmail = require("../services/email");
const Attorney = require("../models/attorneyModel");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


const sendOtpEmail = async (fullname, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Account Verification OTP",
      html: `
        <div style="font-family: Arial; padding:20px">
          <h2>Hello ${fullname},</h2>
          <p>Your OTP for account verification is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Email sending failed");
  }
};

/* ================= ATTORNEY SIGNUP ================= */
exports.attorneySignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body || {};

    // 1️⃣ Required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    // 2️⃣ Name validation
    if (firstName.length < 2 || firstName.length > 50) {
      return res.status(400).json({ message: "First name must be 2-50 characters" });
    }

    if (lastName.length < 2 || lastName.length > 50) {
      return res.status(400).json({ message: "Last name must be 2-50 characters" });
    }

    // 3️⃣ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 4️⃣ Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 6-20 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // 5️⃣ Confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 6️⃣ Check existing user
    const existingAttorney = await Attorney.findOne({ where: { email } });

    // Case 1: Already verified → block
    if (existingAttorney && existingAttorney.isVerified) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // 🔁 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔁 Case 2: Exists but NOT verified → resend OTP
    if (existingAttorney && !existingAttorney.isVerified) {
      existingAttorney.resetOtp = otp;
      existingAttorney.resetOtpExpire = new Date(Date.now() + 5 * 60 * 1000);
      existingAttorney.resetOtpVerified = false;

      await existingAttorney.save();

      await sendOtpEmail(
        `${existingAttorney.firstName} ${existingAttorney.lastName}`,
        email,
        otp
      );

      return res.status(200).json({
        message: "signup verify OTP resent. Please verify your email",
      });
    }

    // ✅ Case 3: New user → create
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAttorney = await Attorney.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      termsAccepted: false,
      status: "inactive", 
      isVerified: false,
      resetOtp: otp,
      resetOtpExpire: new Date(Date.now() + 5 * 60 * 1000),
      resetOtpVerified: false,
    });

    // 📩 Send OTP
    await sendOtpEmail(`${firstName} ${lastName}`, email, otp);

    return res.status(201).json({
      message: "signup verify OTP sent to email",
      attorneyId: newAttorney.id, // ✅ correct
    });

  } catch (error) {
    console.error("Signup Error:", error);
    console.error("Details:", error.errors);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors,
    });
  }
};

/* ================= ATTORNEY LOGIN ================= */
exports.attorneyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const attorney = await Attorney.findOne({ where: { email } });
    if (!attorney) return res.status(404).json({ message: "attorney not found" });

    const isMatch = await bcrypt.compare(password, attorney.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        if (!attorney.isVerified) {
      return res.status(401).json({
        status: false,
        message: "Please verify OTP first to complete signup",
      });
    }

    res.status(200).json({
      message: "Login successful",
      attorney: {
        id: attorney.id,
        firstName: attorney.firstName,
        lastName: attorney.lastName,
        email: attorney.email,
        token: generateToken(attorney.id),
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= GET ALL ATTORNEYS ================= */
exports.getAllAttorneys = async (req, res) => {
  try {
    const attorneys = await Attorney.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ count: attorneys.length, attorneys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= DELETE ATTORNEY ================= */
exports.deleteAttorney = async (req, res) => {
  try {
    const { id } = req.params;

    const attorney = await Attorney.findByPk(id);
    if (!attorney) return res.status(404).json({ message: "attorney not found" });

    await attorney.destroy();

    res.status(200).json({
      message: `Attorney with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ================= UPDATE ATTORNEY PROFILE ================= */
exports.updateAttorneyProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const attorney = await Attorney.findByPk(id);
    if (!attorney)
      return res.status(404).json({ message: "Attorney not found" });

    // ✅ FIRST destructure req.body
    const {
      firstName,
      lastName,
      email,
      password,
      street,
      aptBlock,
      city,
      state,
      country,
      location,
      zipCode,
      phoneCell,
      phoneHome,
      phoneOffice,
      dob,
      language,
      admission,
      servicesOffered,
      education,
      experience,
      barCouncilIndiaNo,
      barCouncilStateNo,
      familyLawPractice,
      familyDetails,
      termsAccepted,
      aboutus,
      categoryId,
      linkedin,
      twitter,
      facebook,
      gmail,
      servicesId,
      status

    } = req.body;

    // if (!termsAccepted) {
    //   return res.status(400).json({
    //     message: "Please accept Terms & Conditions",
    //   });
    // }

    // ✅ THEN check password
    let updatedPassword = attorney.password;

    if (password && password.trim() !== "") {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    await attorney.update({
  firstName,
  lastName,
  email,
  password: updatedPassword,
  street,
  aptBlock,
  city,
  state,
  country,
  location,
  zipCode,
  phoneCell,
  phoneHome,
  phoneOffice,
  dob,
  admission,
  language: language ? language : attorney.language,
  servicesOffered,
  education,
  experience,
  barCouncilIndiaNo,
  barCouncilStateNo,
  familyLawPractice,
  familyDetails,

kycIdentity: req.files?.kycIdentity?.[0]
  ? `/uploads/${req.files.kycIdentity[0].filename}`
  : null,

kycAddress: req.files?.kycAddress?.[0]
  ? `/uploads/${req.files.kycAddress[0].filename}`
  : null,

profileImage: req.files?.profileImage?.[0]
  ? `/uploads/${req.files.profileImage[0].filename}`
  : null,

resume: req.files?.resume?.[0]
  ? `/uploads/${req.files.resume[0].filename}`
  : null,

barCouncilIndiaId: req.files?.barCouncilIndiaId?.[0]
  ? `/uploads/${req.files.barCouncilIndiaId[0].filename}`
  : null,

barCouncilStateId: req.files?.barCouncilStateId?.[0]
  ? `/uploads/${req.files.barCouncilStateId[0].filename}`
  : null,
  aboutus,
      categoryId,
      linkedin,
      twitter,
      facebook,
      gmail,
      status: status ? status : attorney.status,
      servicesId,
  termsAccepted
});
    res.status(200).json({
      message: "Attorney profile updated successfully",
      attorney
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const attorney = await Attorney.findOne({ where: { email } });
    if (!attorney) return res.status(404).json({ message: "attorney not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
    attorney.resetOtp = otp;
    attorney.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    attorney.resetOtpVerified = false;
    await attorney.save();

    await sendEmail(`${attorney.firstName} ${attorney.lastName}`, email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email & OTP required" });

    const attorney = await Attorney.findOne({ where: { email } });
    if (!attorney) return res.status(404).json({ message: "attorney not found" });
    if (attorney.resetOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    
    if (attorney.resetOtpExpire < Date.now())
      return res.status(400).json({ message: "OTP expired" });
    
  attorney.isVerified = true;
attorney.status = "active";   
attorney.resetOtpVerified = true;
    await attorney.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword)
      return res.status(400).json({
        message: "Email, new password & confirm password required",
      });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const attorney = await Attorney.findOne({ where: { email } });
    if (!attorney) return res.status(404).json({ message: "attorney not found" });

    if (!attorney.resetOtpVerified)
      return res.status(400).json({ message: "OTP not verified yet" });

    attorney.password = await bcrypt.hash(newPassword, 10);
    attorney.resetOtp = null;
    attorney.resetOtpExpire = null;
    attorney.resetOtpVerified = false;

    await attorney.save();

    res.status(200).json({ message: "Password Update successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ================= GET ATTORNEY BY ID ================= */
exports.getAttorneyById = async (req, res) => {
  try {
    const { id } = req.params;

    const attorney = await Attorney.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!attorney) {
      return res.status(404).json({ message: "Attorney not found" });
    }

    res.status(200).json({
      message: "Attorney fetched successfully",
      attorney,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



/* ================= GET ALL ADMISSION ================= */
exports.getAllAdmission = async (req, res) => {
  try {
    const attorneys = await Attorney.findAll({
      attributes: ["admission"],   
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      count: attorneys.length,
      data: attorneys,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

/* ================= GET ALL EDUCATION ================= */
exports.getAllEducation = async (req, res) => {
  try {
    const attorneys = await Attorney.findAll({
      attributes: ["education"],   
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      count: attorneys.length,
      data: attorneys,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};