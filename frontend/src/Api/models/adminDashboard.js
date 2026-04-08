const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");
const Role = require("./rolemodel");

const AdminDashboard = sequelize.define(
  "admindashboard",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    designation: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "admindashboard",
    freezeTableName: true,
    timestamps: true,
  }
);


module.exports = AdminDashboard;
