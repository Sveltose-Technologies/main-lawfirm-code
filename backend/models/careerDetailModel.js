const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CareerDetail = sequelize.define("career_details", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  bannerImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  bannerText: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },

  description: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
}, {
      tableName: "career_details",
    freezeTableName: true,
    timestamps: true,
});

module.exports = CareerDetail;