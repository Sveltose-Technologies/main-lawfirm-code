const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CapabilityContent = sequelize.define(
  "cms_category",
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

    subcategoryIds: {
      type: DataTypes.JSON,   
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT("long"), 
      allowNull: false,
    },
  },
  {
    tableName: "cms_category",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = CapabilityContent;
