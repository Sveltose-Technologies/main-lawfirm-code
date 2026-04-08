const express = require("express");
const { createPermission, getPermissions, getPermissionById, updatePermission, deletePermission, createMultiplePermissions } = require("../controllers/permissionController");
const router = express.Router();

// CRUD routes
router.post("/create", createPermission);
router.post("/create-multiple", createMultiplePermissions);
router.get("/get-all", getPermissions);
router.get("/get-by-id/:id", getPermissionById);
router.put("/update/:id", updatePermission);
router.delete("/delete/:id", deletePermission);

module.exports = router;