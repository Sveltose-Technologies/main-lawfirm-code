const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const HomeBannerText = sequelize.define(
  "home_banner_text",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    textEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = HomeBannerText;