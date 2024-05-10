const Sequelize = require("sequelize");
const sequelize = require("../utils/dbConn");

const ResetPasswordModel = sequelize.define("resetPasswords", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  isActive: Sequelize.BOOLEAN,
});

module.exports = ResetPasswordModel;