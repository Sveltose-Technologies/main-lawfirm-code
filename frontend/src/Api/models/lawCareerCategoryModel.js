const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const LawCareerCategory = sequelize.define(
  "law_career_categories",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.ENUM(
        "Law Students",
        "Attorneys",
        "Professional Staff"
      ),
      allowNull: false,
    },
  },
  {
    tableName: "law_career_categories",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = LawCareerCategory;