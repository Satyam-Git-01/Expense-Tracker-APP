const express = require("express");
const authentication = require("../middlewares/auth");
const {
  getAllExpenses,
  getHomePage,
  addExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const expenseRoute = express.Router();

expenseRoute.get("/", getHomePage);
expenseRoute.get("/getAllExpenses", getAllExpenses);
expenseRoute.post("/addExpense", authentication, addExpense);
expenseRoute.delete("/delete/:id", deleteExpense);
module.exports = expenseRoute;
