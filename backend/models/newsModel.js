const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const News = sequelize.define(
  "news",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    attorneyId: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    capabilityCategoryId: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    countryId: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    cityId: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    textEditor: {
      type: DataTypes.TEXT("long"), // HTML Text Editor
      allowNull: true,
    },

    socialLinks: {
  type: DataTypes.JSON,
  allowNull: true,
  defaultValue: { linkedin: "", twitter: "", facebook: "", email: "" },
},


    newsImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "news",
    timestamps: true,
  }
);

module.exports = News;
