const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const OurFirm = sequelize.define(
  "our_firm",
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
    /* ---------- BANNER ---------- */
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /* ---------- INNOVATION ---------- */
    innovationContent: {
      type: DataTypes.TEXT("long"), // text editor HTML
      allowNull: false,
    },
    innovationImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /* ---------- PEOPLE ---------- */
    peopleContent: {
      type: DataTypes.TEXT("long"), // text editor HTML
      allowNull: false,
    },
    peopleImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /* ---------- HISTORY ---------- */
    historyContent: {
      type: DataTypes.TEXT("long"), // text editor HTML
      allowNull: false,
    },
    historyImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "our_firm",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = OurFirm;
