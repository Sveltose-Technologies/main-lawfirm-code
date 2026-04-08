const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const HomeData = sequelize.define(
  "home_data",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    firstTextEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    middleText: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    secondImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    secondTextEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    thirdImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    thirdTextEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    fourthImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    fourthTextEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    tableName: "home_data",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = HomeData;