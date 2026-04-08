const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");
const sendEmail = require("../services/email");
const express = require("express");

const User = sequelize.define(
    "users",
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
         
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        phoneNo : {
            type: DataTypes.STRING,
            allowNull: true
        },

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },  

        cityId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
      

            // OTP fields for forgot password
 resetOtp: {
  type: DataTypes.STRING,
},

resetOtpExpire: {
  type: DataTypes.DATE,  
},

resetOtpVerified: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},


    },
    {
        tableName: "users",
        freezeTableName: true,
        timestamps: true
    }
);

module.exports = User;