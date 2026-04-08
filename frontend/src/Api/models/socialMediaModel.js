const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const SocialMedia = sequelize.define(
  "SocialMedia",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facebookUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitterUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagramUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedinUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "social_media",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = SocialMedia;
