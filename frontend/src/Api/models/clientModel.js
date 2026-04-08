const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig.js"); // adjust path if needed

const Client = sequelize.define(
  "client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },

    mobile: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    aptBlock: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    zipCode: { type: DataTypes.STRING },
    countryCode: { type: DataTypes.STRING },

    dob: { type: DataTypes.DATE },

    profileImage: { type: DataTypes.STRING },
    kycIdentity: { type: DataTypes.STRING },
    kycAddress: { type: DataTypes.STRING },

    termsAccepted: { type: DataTypes.BOOLEAN, defaultValue: false },

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

isVerified: {
  type: DataTypes.BOOLEAN,  
  defaultValue: false,
},

status: {
     type: DataTypes.ENUM("active", "inactive", "verified"),
     defaultValue: "inactive"
    },
  },
  {
    tableName: "client",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Client;
