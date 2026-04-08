// models/conversationParticipant.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const ConversationParticipant = sequelize.define(
  "conversation_participants",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("client", "admin", "attorney"),
      allowNull: false,
    },
  },
  {
    tableName: "conversation_participants",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = ConversationParticipant;