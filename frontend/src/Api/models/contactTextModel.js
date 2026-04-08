const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const ContactText = sequelize.define(
  "contact_text",
  {
    contactText: {
      type: DataTypes.TEXT("long"), // TextEditor HTML content
      allowNull: false,
    },
  },
  {
    tableName: "contact_text",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = ContactText;