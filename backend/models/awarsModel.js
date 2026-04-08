const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig.js");

const Awards = sequelize.define(
  "awards",
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

    bannerImage: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    personName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    
     peopleImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    organization: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    awardTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    details: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "awards",
    timestamps: true,
  }
);


module.exports = Awards;
