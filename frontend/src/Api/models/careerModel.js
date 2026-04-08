const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Career = sequelize.define(
  "careers",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    jobCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    jobCategoryId: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    lawCareerCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
    },

    location: {
      type: DataTypes.ENUM("Onsite", "Hybrid", "Remote"),
      allowNull: false,
    },

    jobType: {
      type: DataTypes.ENUM("FullTime", "PartTime"),
      allowNull: false,
    },

    textEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    skills:{
         type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    education:{
         type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    technology:{
          type: DataTypes.TEXT("long"),
      allowNull: false,
    }

  },
  {
    tableName: "careers",
    timestamps: true,
  }
);

module.exports = Career;