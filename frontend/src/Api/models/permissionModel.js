const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Permission = sequelize.define(
  "permission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    
  },
  {
    tableName: "permission",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Permission;