const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CapabilitySubcategory = sequelize.define(
  "capability_subcategories",
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

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subcategoryName: {
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
    tableName: "capability_subcategories",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = CapabilitySubcategory;
