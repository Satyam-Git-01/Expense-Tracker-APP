const express = require("express");
const authentication = require("../middlewares/auth");
const {
  getAllExpenses,
  getHomePage,
  addExpense,
  deleteExpense,
  downloadExpenseReport,
} = require("../controllers/expenseController");
const expenseRoute = express.Router();

expenseRoute.get("/", getHomePage);
expenseRoute.get("/getAllExpenses", authentication, getAllExpenses);
expenseRoute.post("/addExpense", authentication, addExpense);
expenseRoute.delete("/delete/:id",authentication, deleteExpense);
expenseRoute.get("/downloadExpenses", authentication, downloadExpenseReport);
module.exports = expenseRoute;
