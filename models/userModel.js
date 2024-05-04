const Sequelize = require("sequelize");
const sequelize = require("../utils/dbConn");
const userModel = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type:Sequelize.STRING,
    unique:true,
    allowNull:false

  },
  password: Sequelize.STRING,
});

module.exports = userModel;
