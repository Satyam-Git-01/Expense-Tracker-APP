const path = require("path");
const expenseModel = require("../models/expenseModel");
const userModel = require("../models/userModel");
const sequelize = require("../utils/dbConn");
const fileDownloadedModel = require("../models/fileDownloadedModel");
const AWS = require("aws-sdk");
const getHomePage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homepage.html"));
};
const getAllExpenses = async (req, res, next) => {
  try {
    const result = await expenseModel.findAll();
    return res.status(200).json({ success: true, result: result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error While Getting Data" });
  }
};

const uploadTos3 = async (data, fileName) => {
  const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
  const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

  let s3bucket = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  });

  let params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(s3response);
        resolve(s3response.Location);
      }
    });
  });
};

const downloadExpense = async (req, res, next) => {
  const data = await getExpenses(req.user.id);
  console.log(data);
  const strinfiiedData = JSON.stringify(data);
  const fileName = `Expense-${req.user.id}/${new Date()}.txt`;
  const fileURL = await uploadTos3(strinfiiedData, fileName);
  const result = await fileDownloadedModel.create({
    url: fileURL,
    userId: req.user.id,
  });
  console.log(result);
  return res.status(200).json({ success: true, fileURL: fileURL });
};

const getExpenses = async (userId) => {
  try {
    const data = await expenseModel.findAll({
      where: {
        userId: userId,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    //return res.send(500).json({ error: "ErrorF" });
  }
  return -1;
};

const addExpense = async (req, res, next) => {
  const { date, amount, description, category } = req.body;
  const trans = await sequelize.transaction();
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
      { transaction: trans }
    );
    const result = await expenseModel.create(
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
  }
  return res
    .json(400)
    .json({ success: false, message: "Error while adding Expense" });
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
  getExpenses,
  deleteExpense,
  downloadExpense,
};
