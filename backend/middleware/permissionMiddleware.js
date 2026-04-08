// middleware/permissionMiddleware.js

// exports.checkPermission = (module, action) => {
//   return (req, res, next) => {

//     const permission = `${module}_${action}`;

//     if (req.user.role === "super_admin") {
//       return next();
//     }

//     if (!req.user.permissions.includes(permission)) {
//       return res.status(403).json({
//         message: "Access Denied",
//       });
//     }

//     next();
//   };
// };



const { Role, Permission } = require("../models");

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.roleId;

      const role = await Role.findByPk(roleId, {
        include: {
          model: Permission,
          attributes: ["name"],
          through: { attributes: [] },
        },
      });

      const permissions = role.Permissions.map(p => p.name);

      if (!permissions.includes(permissionName)) {
        return res.status(403).json({
          status: false,
          message: "Access Denied",
        });
      }
       if (req.user.role === "admin") {
  return next();
}
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Permission error" });
    }
  };
};

module.exports = checkPermission;