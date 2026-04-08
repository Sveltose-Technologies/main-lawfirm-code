const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Event = sequelize.define(
  "event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
 bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

     startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    capabilityCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subcategoryIds: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cityIds: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    registrationLink: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    linkedin: {
      type: DataTypes.STRING,
    },

    facebook: {
      type: DataTypes.STRING,
    },

    twitter: {
      type: DataTypes.STRING,
    },
   
    gmail: {
      type: DataTypes.STRING,
    },
    attorneyIds: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "event",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Event;
