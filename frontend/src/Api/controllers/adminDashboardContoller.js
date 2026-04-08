const User = require("../models/adminDashboard");
const Role = require("../models/rolemodel");

// ➕ Create User
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, designation } =
      req.body;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password must match" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      designation,
    });

    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get All Users
exports.getAllAdminUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, password, confirmPassword, designation } =
      req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password && password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password must match" });
    }

    await user.update({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      designation,
    });
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑 Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
