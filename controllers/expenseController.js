const path = require("path");
const sequelize = require("../utils/dbConn");
const { uploadTos3 } = require("../services/S3Services");

const expenseModel = require("../models/expenseModel");
const userModel = require("../models/userModel");
const fileDownloadedModel = require("../models/fileDownloadedModel");

const getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homepage.html"));
};

const getAllExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenses = await expenseModel.findAll({
      where: {
        userId: userId,
      },
    });
    return res.status(200).json({ success: true, result: expenses });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Can not get All Expenses at this moment",
    });
  }
};

const downloadExpenseReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenses = await getExpenses(userId);
    const stringifiedData = JSON.stringify(expenses);
    const fileName = `Expense-${req.user.id}/${new Date()}.txt`;
    const fileURL = await uploadTos3(stringifiedData, fileName);
    const result = await fileDownloadedModel.create({
      url: fileURL,
      userId: userId,
    });
    return res.status(200).json({ success: true, fileURL: fileURL });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, fileURL: null });
  }
};

/**
 * @description get all expenses of a given userId
 * @param {*} userId
 * @returns
 */
const getExpenses = async (userId) => {
  try {
    const data = await expenseModel.findAll({
      where: {
        userId: userId,
      },
    });
    return data;
  } catch (err) {
    return null;
  }
};

const addExpense = async (req, res, next) => {
  const trans = await sequelize.transaction();
  try {
    let previousTotalExpenses = req.user.totalExpenses;
    const userId = req.user.id;
    const { date, amount, description, category } = req.body;
    await userModel.update(
      {
        totalExpenses: Number(previousTotalExpenses) + Number(amount),
      },
      {
        where: {
          id: userId,
        },
      },
      { transaction: trans }
    );
    await expenseModel.create(
      {
        date,
        amount,
        description,
        category,
        userId: req.user.id,
      },
      { transaction: trans }
    );
    await trans.commit();
    return res
      .status(201)
      .json({ success: true, message: "expense added successfully" });
  } catch (err) {
    await trans.rollback();
    console.log(err);
    return res
      .json(400)
      .json({ success: false, message: "Error while adding Expense" });
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    await expenseModel.destroy({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error While Deleting Expense" });
  }
};
module.exports = {
  getAllExpenses,
  getHomePage,
  addExpense,
  getExpenses,
  deleteExpense,
  downloadExpenseReport,
};
