const { Sequelize } = require("sequelize");
const dbConnection = new Sequelize(
  process.env.DB_SCHEMA,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
  }
);
module.exports = dbConnection;
