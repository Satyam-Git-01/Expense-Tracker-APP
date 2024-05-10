const Sequelize = require("sequelize");
const sequelize = require("../utils/dbConn");

const ExpenseModel = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  amount: Sequelize.INTEGER,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
});

module.exports = ExpenseModel;
