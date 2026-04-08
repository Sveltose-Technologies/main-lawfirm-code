const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");
const Category = require("./capabilitiescategoriesModel");

const CareerFront = sequelize.define(
  "career_front",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    categoryId : {
         type: DataTypes.INTEGER,
      allowNull: false,
    },

    bannerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bannerText:{
        type: DataTypes.TEXT("long"),
        allowNull: true
    },

    firstText: {
        type: DataTypes.TEXT("long"), 
      allowNull: true,
    },

    firstImage: {
       type: DataTypes.STRING,
      allowNull: true,
    },

    secondText: {
      type: DataTypes.TEXT("long"), 
      allowNull: true,
    },

    secondImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    thirdText: {
      type: DataTypes.TEXT("long"), 
      allowNull: true,
    },

     thirdImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
       countryId: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "career_front",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = CareerFront;

