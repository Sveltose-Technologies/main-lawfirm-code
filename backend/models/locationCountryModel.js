const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CountryContent = sequelize.define(
  "location_country",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    countryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT("long"), // text editor HTML
      allowNull: false,
    },
  },
  {
    tableName: "location_country",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = CountryContent;
