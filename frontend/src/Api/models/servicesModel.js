const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const Services = sequelize.define(
    "services",
    {
      id: {
         type : DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      } ,

    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    }
    },
    {
        timestamps : true,
        tableName : "services",
        freezeTableName: true,    
    }

);

module.exports = Services;