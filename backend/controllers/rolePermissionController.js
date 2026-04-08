const { RolePermission } = require("../models");

/* ================= CREATE ================= */
exports.createRolePermission = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    // ✅ Check array
    if (!Array.isArray(permissionId)) {
      return res.status(400).json({
        status: false,
        message: "permissionId must be an array",
      });
    }

    // ✅ Create multiple entries
    const data = await Promise.all(
      permissionId.map((permId) =>
        RolePermission.create({
          roleId,
          permissionId: permId,
        })
      )
    );

    res.status(201).json({
      status: true,
      message: "Role Permissions created",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating role permission" });
  }
};

/* ================= GET ALL ================= */
exports.getAllRolePermissions = async (req, res) => {
  try {
    const data = await RolePermission.findAll();

    res.json({
      status: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

/* ================= GET BY ID ================= */
exports.getRolePermissionById = async (req, res) => {
  try {
    const data = await RolePermission.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Not found",
      });
    }

    res.json({
      status: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

/* ================= UPDATE ================= */
exports.updateRolePermission = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    const data = await RolePermission.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Not found",
      });
    }

    await data.update({
      roleId,
      permissionId,
    });

    res.json({
      status: true,
      message: "Updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating" });
  }
};

/* ================= DELETE ================= */
exports.deleteRolePermission = async (req, res) => {
  try {
    const data = await RolePermission.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Not found",
      });
    }

    await data.destroy();

    res.json({
      status: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting" });
  }
};