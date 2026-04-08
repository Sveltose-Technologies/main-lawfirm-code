const express = require("express");
const router = express.Router();

const {
  createRolePermission,
  getAllRolePermissions,
  getRolePermissionById,
  updateRolePermission,
  deleteRolePermission,
} = require("../controllers/rolePermissionController");

/* ================= ROUTES ================= */

router.post("/create", createRolePermission);
router.get("/get-all", getAllRolePermissions);
router.get("/get-by-id/:id", getRolePermissionById);
router.put("/update/:id", updateRolePermission);
router.delete("/delete/:id", deleteRolePermission);

module.exports = router;