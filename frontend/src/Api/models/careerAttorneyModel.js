const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CarrerAttorney = sequelize.define("career_attorney", {
    id: {
        type: sequelize.Sequelize.INTEGER,  
        autoIncrement: true,
        primaryKey: true    
    },

    image : {
       type: DataTypes.STRING,
         allowNull: true
    },

    categoryId: {
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


},{
    tableName: "career_attorney",
    freezeTableName: true,
    timestamps: true
}

)

module.exports = CarrerAttorney;