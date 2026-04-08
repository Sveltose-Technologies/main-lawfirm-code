const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const PrivacyPolicy = sequelize.define(
  "privacy_policies",
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

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT("long"), 
      allowNull: false,
    },
  },
  {
    tableName: "privacy_policies",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = PrivacyPolicy;
