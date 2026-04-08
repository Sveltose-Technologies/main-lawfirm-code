const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const EventBanner = sequelize.define(
  "event_banner",
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
    textEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "event_banner",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = EventBanner;