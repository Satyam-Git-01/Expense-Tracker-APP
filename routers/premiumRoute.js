const express = require("express");
const { getLeaderBoardData } = require("../controllers/premiumController");
const premiumRoute = express.Router();

premiumRoute.get("/getLeaderBoardData",getLeaderBoardData);

module.exports = premiumRoute;
