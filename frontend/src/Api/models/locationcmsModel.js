const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const LocationContent = sequelize.define("location_cms", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  adminId: { type: DataTypes.INTEGER, allowNull: false },
  countryId: { type: DataTypes.INTEGER, allowNull: false },
  cityId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT("long"), allowNull: false },
}, {
      tableName: "location_cms",
  freezeTableName: true,
  timestamps: true,
});

module.exports = LocationContent;
