const Role = require("../models/rolemodel");

// ➕ Create Role
exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({
        message: "roleName is required",
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { roleName } });
    if (existingRole) {
      return res.status(409).json({
        message: "Role already exists",
      });
    }

    const role = await Role.create({ roleName});

    res.status(201).json({
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// find all
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "All Roles fetched successfully",
      count: roles.length,roles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// find by Id
 exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;    
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }   
    res.status(200).json({
      message: "Role fetched successfully",
      data: role,
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.update({ roleName });

    res.status(200).json({
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑 Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.destroy();

    res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
