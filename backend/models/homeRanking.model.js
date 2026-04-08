const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const HomeRanking = sequelize.define(
  "home_ranking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    rankingText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    rankingNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    languageText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    languageNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    countrieText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    countrieNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    locationText: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    locationNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    textEditor: {
      type: DataTypes.TEXT("long"),   // For HTML content
      allowNull: false,
    },
  },
  {
    tableName: "home_ranking",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = HomeRanking;