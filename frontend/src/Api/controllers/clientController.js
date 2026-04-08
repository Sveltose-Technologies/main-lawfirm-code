const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/email.js");
const Client = require("../models/clientModel.js");
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
exports.clientsignup = async (req, res) => {
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
    const existingclient = await Client.findOne({ where: { email } });

    // Case 1: Already verified → block
    if (existingclient && existingclient.isVerified) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // 🔁 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔁 Case 2: Exists but NOT verified → resend OTP
    if (existingclient && !existingclient.isVerified) {
      existingclient.resetOtp = otp;
      existingclient.resetOtpExpire = new Date(Date.now() + 5 * 60 * 1000);
      existingclient.resetOtpVerified = false;

      await existingclient.save();

      await sendOtpEmail(
        `${existingclient.firstName} ${existingclient.lastName}`,
        email,
        otp
      );

      return res.status(200).json({
        message: "signup verify OTP resent. Please verify your email",
      });
    }

    // ✅ Case 3: New user → create
    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await Client.create({
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
      attorneyId: newClient.id, 
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


// Login Controller
exports.clientlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const client = await Client.findOne({ where: { email } });
    if (!client) return res.status(404).json({ message: "client not found" });

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
   
    
        if (!client.isVerified) {
      return res.status(401).json({
        status: false,
        message: "Please verify OTP first to complete signup",
      });
    }

    res.status(200).json({
      message: "Login successful",
      client: {
        id: client.id,
        firstName: client.firstName,  
        lastName: client.lastName,
        email: client.email,
        token: generateToken(client.id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password", "captcha"] },
    });

    res.status(200).json({ count: clients.length, clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    await client.destroy();

    res.status(200).json({
      message: `client with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update Profile+
exports.updateClientProfile = async (req, res) => {
  try {
    const { id } = req.params; 
    const {
      firstName, lastName, email, mobile,
      street, aptBlock, city, state, country, zipCode,
      countryCode, dob, password, termsAccepted, status
    } = req.body;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: "client not found" });
    
    let hashedPassword = client.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // // Update profile image 
    const profileImage =  req.files?.profileImage?.[0]
  ? `/uploads/${req.files.profileImage[0].filename}`
  : null;
    const kycIdentity =  req.files?.kycAddress?.[0]
  ? `/uploads/${req.files.kycAddress[0].filename}`
  : null;
    const kycAddress = req.files?.kycAddress?.[0]
  ? `/uploads/${req.files.kycAddress[0].filename}`
  : null;

   await client.update({
  firstName: firstName ?? client.firstName,
  lastName: lastName ?? client.lastName,
  email: email ?? client.email,
  mobile: mobile ?? client.mobile,
  street: street ?? client.street,
  aptBlock: aptBlock ?? client.aptBlock,
  city: city ?? client.city,
  state: state ?? client.state,
  country: country ?? client.country,
  zipCode: zipCode ?? client.zipCode,
  countryCode: countryCode ?? client.countryCode,
  dob: dob ? new Date(dob) : client.dob,
  password: hashedPassword,
  profileImage,
  kycIdentity,
  kycAddress,
  termsAccepted: termsAccepted ?? client.termsAccepted,
  status,
});

    res.status(200).json({ message: "Profile updated successfully", client });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Step 1: Send OTP to client email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    client.resetOtp = otp;
    client.resetOtpExpire = Date.now() + 10 * 60 * 1000; 
    client.resetOtpVerified = false;

    await client.save();

    await sendEmail(
      `${client.firstName} ${client.lastName}`,
      email,
      otp
    );

    return res.status(200).json({
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// Step 2: Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const {email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email & OTP required"
      });
    }

    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    if (client.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (client.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    client.status = "active";  
    client.isVerified = true;
    client.resetOtpVerified = true;
    await client.save();

    return res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Step 3: Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Email, new password & confirm password required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    if (!client.resetOtpVerified) {
      return res.status(400).json({
        message: "OTP not verified yet"
      });
    }

    client.password = await bcrypt.hash(newPassword, 10);

    client.resetOtp = null;
    client.resetOtpExpire = null;
    client.resetOtpVerified = false;

    await client.save();

    return res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


exports.getClientById = async (req,res) => {
 try {
      
  const client = await Client.findByPk(req.params.id, {
    attributes: { exclude: ["password"] },
  })


  if(!client) {
    res.status(400).json({message: "client not found"})
  }

  res.status(200).json({ message: " client fetched successfully", client})
 } catch (error) {
     res.status(500).json({message:"server error", error: error.message})
 }
};