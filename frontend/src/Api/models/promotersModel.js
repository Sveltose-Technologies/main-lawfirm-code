const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Promoter = sequelize.define(
  "promoters",
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
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

     mobileNo: 
     { type: DataTypes.STRING },

    personName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    personImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

designation: {
  type: DataTypes.TEXT,
  allowNull: false,
},

specialization: {
  type: DataTypes.TEXT,
  allowNull: true,
},
    
  },
  {
    tableName: "promoters",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Promoter;
