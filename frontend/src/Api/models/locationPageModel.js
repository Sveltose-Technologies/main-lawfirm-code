const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const LocationPage = sequelize.define(
  "location_page",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    bannerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    content: {
      type: DataTypes.TEXT("long"), // text editor content
      allowNull: false,
    },
  },
  {
    tableName: "location_page",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = LocationPage;