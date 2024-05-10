const Sequelize = require("sequelize");
const sequelize = require("../utils/dbConn");

const FileDownloadedModel = sequelize.define("filesdownloaded", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: Sequelize.STRING,
});

module.exports=FileDownloadedModel;
