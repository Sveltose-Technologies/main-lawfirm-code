const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const HomeCount = sequelize.define(
  "home_count",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    consultationsText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    consultationsNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    successRateText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    successRateCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    yearsExperienceText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    yearsExperienceCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    attorneysText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    attorneysCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "home_count",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = HomeCount;