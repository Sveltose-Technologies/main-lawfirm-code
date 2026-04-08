const Permission = require("./permissionModel");
const Role = require("./rolemodel");
const RolePermission = require("./rolePermissionModel");
const User = require("./userModel");

// Role ↔ Permission
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
});

// User ↔ Role
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

module.exports = {
  Role,
  Permission,
  RolePermission,
  User,
};