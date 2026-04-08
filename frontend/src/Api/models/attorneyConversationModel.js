const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const AttorneyConversation = sequelize.define(
  "attorney_conversations",
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

    attorneyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    senderType: {
      type: DataTypes.ENUM("admin", "attorney"),
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
    tableName: "attorney_conversations",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = AttorneyConversation;