const path = require("path");
const expenseModel = require("../models/expenseModel");
const userModel = require("../models/userModel");
const { where } = require("sequelize");
const sequelize = require("../utils/dbConn");
const getHomePage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homepage.html"));
};
const getAllExpenses = async (req, res, next) => {
  try {
    const result = await expenseModel.findAll();
    return res.status(200).json({ success: true, result: result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error While Getting Data" });
  }
};

const addExpense = async (req, res, next) => {
  const { amount, description, category } = req.body;
  const transcation = sequelize.transaction();
  console.log(req.user);
  try {
    await userModel.update(
      {
        totalExpenses: req.user.totalExpenses + Number(amount),
      },
      {
        where: {
          id: req.user.id,
        },
      },
      { transcation: transcation }
    );
    const result = await expenseModel.create({
      amount,
      description,
      category,
      userId: req.user.id,
    });
    return res
      .status(201)
      .json({ success: true, message: "expense added successfully" });
  } catch (err) {
    console.log(err);
  }
  res.json(400).json({ success: false, message: "Error while adding Expense" });
};

const deleteExpense = async (req, res, next) => {
  console.log(req.params.id);
  const result = expenseModel.destroy({ where: { id: req.params.id } });
  console.log(result);
  res.status(200).json({ success: true, message: "Deleted" });
};
module.exports = {
  getAllExpenses,
  getHomePage,
  addExpense,
  deleteExpense,
};
