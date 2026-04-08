const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const clientConversation = sequelize.define(
  "client_conversations",
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

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    senderType: {
      type: DataTypes.ENUM("admin", "client"),
      allowNull: false,
    },
      message: {
  type: DataTypes.TEXT,
  allowNull: true, 
},

    image: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

    attachment: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

  },
  {
    tableName: "client_conversations",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = clientConversation;