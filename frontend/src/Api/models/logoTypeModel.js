const { DataTypes } = require("sequelize");
const sequelize = require("../configer/dbconfig");

const LogoType = sequelize.define(
  "logo_types",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM("logo", "banner"),
      allowNull: false,
    },
  },
  {
    tableName: "logo_types",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = LogoType;