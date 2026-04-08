const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const RolePermission = sequelize.define(
  "role_permissions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "role_permissions",   
    freezeTableName: true,           
    timestamps: false,               
  }
);

module.exports = RolePermission;