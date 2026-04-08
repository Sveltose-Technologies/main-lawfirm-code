const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CareerProfessional  = sequelize.define(
    "career_professional",
    {
        id: {
            type: DataTypes.INTEGER,  
            autoIncrement: true,
            primaryKey: true    
        },
        image : {
            type: DataTypes.STRING,
            allowNull: true
        },  
       categoryId: {       
    type: DataTypes.INTEGER,  
    allowNull: false
},
        countryId: {
            type: DataTypes.JSON,
            allowNull: false,   
        },
        content: {
            type: DataTypes.TEXT("long"),
            allowNull: true
        },      
    },  
    {       
        tableName: "career_professional",   
        freezeTableName: true,
        timestamps: true
    }
)   

module.exports = CareerProfessional;
