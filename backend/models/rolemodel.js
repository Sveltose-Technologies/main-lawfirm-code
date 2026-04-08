const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
  },
  {
    tableName: "roles",     
    freezeTableName: true,    
    timestamps: true,        
  } 
);

module.exports = Role;
