const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const CarrerBanner = sequelize.define('careerbanner', {
    id: {
        type: DataTypes.INTEGER,    
        autoIncrement: true,    
        primaryKey: true,
    },
    bannerImage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT("long"),
        allowNull: true
    },
     
}, {    
    tableName: 'careerbanner',
    freezeTableName: true,
    timestamps: true,
});

module.exports = CarrerBanner;