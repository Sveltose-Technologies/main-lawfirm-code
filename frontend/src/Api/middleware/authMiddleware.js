// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/rolemodel");
const Permission = require("../models/permissionModel");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      include: { model: Role, include: Permission },
    });

  req.user = {
  id: user.id,
  roleId: user.role.id, // ✅ ADD THIS
  role: user.role.roleName,
  permissions: user.role.permissions.map(p => p.name),
};

    next();

  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};