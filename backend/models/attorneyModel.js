const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig.js");
const Category = require("./capabilitiescategoriesModel.js");

const Attorney = sequelize.define(
  "attorney",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    activationToken: DataTypes.STRING,

    street: DataTypes.STRING(100),
    aptBlock: DataTypes.STRING(50),

    city: DataTypes.INTEGER,
    state: DataTypes.STRING(50),
    country: DataTypes.STRING(50),
    zipCode: DataTypes.STRING(10),

    locationId: DataTypes.INTEGER,

    phoneCell: DataTypes.STRING(15),
    phoneHome: DataTypes.STRING(15),
    phoneOffice: DataTypes.STRING(15),

    dob: DataTypes.DATEONLY,

    language: DataTypes.JSON,

    profileImage: DataTypes.STRING,

    servicesOffered: DataTypes.JSON,

    education: DataTypes.JSON,
    admission: DataTypes.JSON,
    experience: DataTypes.JSON,

    barCouncilIndiaNo: DataTypes.STRING,
    barCouncilIndiaId: DataTypes.STRING,

    barCouncilStateNo: DataTypes.STRING,
    barCouncilStateId: DataTypes.STRING,

    familyLawPractice: DataTypes.BOOLEAN,
    familyDetails: DataTypes.JSON,

    kycIdentity: DataTypes.JSON,
    kycAddress: DataTypes.JSON,

    resume: DataTypes.STRING,

//  resetOtp: { type: DataTypes.STRING },            
//     resetOtpExpire: { type: DataTypes.BIGINT },       
//     resetOtpVerified: { type: DataTypes.BOOLEAN, defaultValue: false }, 
//      isVerified: {
//   type: Boolean,
//   default: false
//      },

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

    termsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    // TextEditor Content
    aboutus: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    // Category Relation
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Social Media Links
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
     type: DataTypes.ENUM("active", "inactive", "verified"),
     defaultValue: "inactive"
    },

     servicesId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
 
  },
  {
    tableName: "attorney",
    timestamps: true,
  }
);

module.exports = Attorney;