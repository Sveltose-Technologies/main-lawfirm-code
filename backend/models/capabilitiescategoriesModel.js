const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Category = sequelize.define(
  "capability_categories",
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

    bannerImage: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "capability_categories",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Category;
