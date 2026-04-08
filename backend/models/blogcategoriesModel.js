const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Blogcategory = sequelize.define(
  "blogcategories",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "blogcategories",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Blogcategory;
