const express = require("express");
const path = require("node:path");
const dotenv = require("dotenv").config();
const sequelize = require("./utils/dbConn");
const bodyParser = require("body-parser");
const app = express();
const userRoute = require("./routers/userRoute");
const expenseRoute = require("./routers/expenseRoute");
const purchaseRoute = require("./routers/purchaseRoute");
const premiumRoute = require("./routers/premiumRoute");
const passwordRoute = require("./routers/passwordRoute");

const PORT_NUMBER = process.env.PORT_NUMBER || 4300;

//Imports for Models
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/orderModel");
const ResetPassword = require("./models/resetPasswordModel");
const FileDownloaded = require("./models/fileDownloadedModel");

//Application Level Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

//Route Level Middlewares
app.use("/", userRoute);
app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/purchase", purchaseRoute);
app.use("/premium", premiumRoute);
app.use("/password", passwordRoute);

//Relationship among the tables
User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
ResetPassword.belongsTo(User);
User.hasMany(ResetPassword);
User.hasMany(FileDownloaded);
FileDownloaded.belongsTo(User);

sequelize
  .sync()
  .then((response) => {
    app.listen(PORT_NUMBER, () => {
      console.log(`APP URL http://localhost:${PORT_NUMBER}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
