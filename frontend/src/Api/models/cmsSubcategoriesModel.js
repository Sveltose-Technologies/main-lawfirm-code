const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CapabilityContent = sequelize.define(
  "cms_subcategory",
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

    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "cms_subcategory",
     freezeTableName: true,
    timestamps: true,
  }
);

module.exports = CapabilityContent;
