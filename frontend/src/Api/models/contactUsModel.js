const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Enquiry = sequelize.define(
  "enquiries",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    inquiryType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,   
      allowNull: true,
    },
  },
  {
    tableName: "enquiries",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Enquiry;
