const userModel = require("../models/userModel");
const Expense = require("../models/expenseModel");
const path = require("path");
const { Op } = require("sequelize");
const AWS = require("aws-sdk");
const getLeaderBoardData = async (req, res, next) => {
  try {
    const result = await userModel.findAll({
      order: [["totalExpenses", "DESC"]],
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Error");
  }
};

const getLeaderBoardPage = async (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "views", "leaderboard.html")
  );
};

const getReportsPage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};



const getDailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;
    const expenses = await Expense.findAll({
      where: { date: date, userId: req.user.id },
    });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
  //res.send("Ok")
};
const getMonthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;

    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.like]: `%-${month}-%`,
        },
        userId: req.user.id,
      },
      raw: true,
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLeaderBoardData,
  getLeaderBoardPage,
  getReportsPage,
  getDailyReports,
  getMonthlyReports,
};
