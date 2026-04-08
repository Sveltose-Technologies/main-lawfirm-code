const { Permission } = require("../models");

/* ================= CREATE ================= */
exports.createPermission = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Permission name is required",
      });
    }

    const permission = await Permission.create({ name });

    res.status(201).json({
      status: true,
      message: "Permission created successfully",
      data: permission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating permission" });
  }
};


exports.createMultiplePermissions  = async (req, res) => {
  try {
    const permissions = req.body.permissions;

    const data = await Permission.bulkCreate(permissions);

    res.json({
      status: true,
      message: "Permissions added",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};
/* ================= GET ALL ================= */
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [["id", "DESC"]],
    });

    res.json({
      status: true,
      total: permissions.length,
      data: permissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching permissions" });
  }
};

/* ================= GET BY ID ================= */
exports.getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        status: false,
        message: "Permission not found",
      });
    }

    res.json({
      status: true,
      data: permission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching permission" });
  }
};

/* ================= UPDATE ================= */
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return res.status(404).json({
        status: false,
        message: "Permission not found",
      });
    }

    await permission.update({ name });

    res.json({
      status: true,
      message: "Permission updated successfully",
      data: permission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating permission" });
  }
};

/* ================= DELETE ================= */
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Permission.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Permission not found",
      });
    }

    res.json({
      status: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting permission" });
  }
};