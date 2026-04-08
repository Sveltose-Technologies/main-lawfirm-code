const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const JobCategory = sequelize.define("job_categories", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  jobCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  tableName: "job_categories",
  freezeTableName: true,
  timestamps: true,
});

module.exports = JobCategory;