const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const AttorneyClientConversation = sequelize.define(
  "attorney_client_conversationss",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    attorneyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    senderType: {
      type: DataTypes.ENUM("attorney", "client"),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image : {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    
    attachment: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

  },
  {
    tableName: "attorney_client_conversations",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = AttorneyClientConversation;