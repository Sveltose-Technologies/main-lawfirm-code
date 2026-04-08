const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Admin = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /* ---------- ADMIN INFO ---------- */
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    password: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    city: DataTypes.STRING,

    profileImage: DataTypes.STRING, // 👤 Admin profile image

    /* ---------- WEBSITE INFO ---------- */
    websiteLogo: DataTypes.STRING, // 🌐 Website logo

      // OTP fields for forgot password
    resetOtp: { type: DataTypes.STRING },            
    resetOtpExpire: { type: DataTypes.BIGINT },       
    resetOtpVerified: { type: DataTypes.BOOLEAN, defaultValue: false }, 

  },
  {
    tableName: "admin",
    timestamps: true,
  }
);

module.exports = Admin;
