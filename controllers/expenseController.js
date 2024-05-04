const path = require("path");
const expenseModel = require("../models/expenseModel");
const getHomePage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homepage.html"));
};
const getAllExpenses = (req, res, next) => {
  res.send("Getting it");
};

const addExpense = async (req, res, next) => {
  const { amount, description, category } = req.body;
  try {
    const result = await expenseModel.create({ amount, description, category });
    return res
      .status(201)
      .json({ success: true, message: "expense added successfully" });
  } catch (err) {
    console.log(err);
  }
  res.json(400).json({success:false,message:"Error while adding Expense"})
};

module.exports = {
  getAllExpenses,
  getHomePage,
  addExpense,
};
