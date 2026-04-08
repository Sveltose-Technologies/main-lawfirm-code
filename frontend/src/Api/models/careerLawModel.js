const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const careerLaw = sequelize.define( 
    'careerlaw',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        image:{
            type: DataTypes.STRING, 
            allowNull: true
        },

        categoryid: {
            type: DataTypes.STRING,
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
        tableName: 'careerlaw',
        freezeTableName: true,
        timestamps: true
    }
)

exports = module.exports = careerLaw;