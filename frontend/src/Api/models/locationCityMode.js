const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const LocationCity = sequelize.define(
  "location_city",
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

    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    faxNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "location_city",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = LocationCity;
