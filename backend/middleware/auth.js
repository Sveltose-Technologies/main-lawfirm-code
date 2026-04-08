const jwt = require("jsonwebtoken");
// const User = require("../models/userModel.js");
const Admin = require("../models/adminModel.js");


// exports.protect = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) return res.status(401).json({ message: "Not authorized, token missing" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findByPk(decoded.id);

//     if (!req.user) return res.status(404).json({ message: "User not found" });

//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token", error: error.message });
//   }
// };

exports.adminOnly  = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Admin token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Ensure admin token
    if (decoded.type !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};