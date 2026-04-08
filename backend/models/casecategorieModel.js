const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig.js");

const Casecategorie = sequelize.define(
  "case_categories",
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

    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "case_categories",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Casecategorie;
