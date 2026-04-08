const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Capability = sequelize.define(
  "capabilities",
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

    textEditor: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "capabilities",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Capability;
