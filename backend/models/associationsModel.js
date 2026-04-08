
const User = require("./userModel");
const Role = require("./rolemodel");
const Permission = require("./permissionModel");
const RolePermission = require("./rolePermissionModel");

// Role ↔ Permission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

// User ↔ Role
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

module.exports = { User, Role, Permission, RolePermission };