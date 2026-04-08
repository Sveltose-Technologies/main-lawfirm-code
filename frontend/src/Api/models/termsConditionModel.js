const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const TermsCondition = sequelize.define(
  "terms_conditions",
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
      type: DataTypes.TEXT("long"), // text editor HTML
      allowNull: false,
    },
  },
  {
    tableName: "terms_conditions",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = TermsCondition;
