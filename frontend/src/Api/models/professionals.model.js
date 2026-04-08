const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Professionals = sequelize.define(
  "professionals",
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
    tableName: "professionals",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Professionals;
