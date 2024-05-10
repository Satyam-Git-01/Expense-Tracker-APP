const express = require("express");
const authentication = require("../middlewares/auth");
const {
  getLeaderBoardData,
  getLeaderBoardPage,
  getReportsPage,
  getDailyReports,
  getMonthlyReports,
} = require("../controllers/premiumController");
const premiumRoute = express.Router();

premiumRoute.get("/getLeaderBoardData", getLeaderBoardData);
premiumRoute.get("/getLeaderBoardPage", getLeaderBoardPage);
premiumRoute.get("/getReportsPage", getReportsPage);
premiumRoute.post("/reports/dailyReports", authentication, getDailyReports);
premiumRoute.post("/reports/monthlyReports", authentication, getMonthlyReports);

module.exports = premiumRoute;
