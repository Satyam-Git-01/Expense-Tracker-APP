const express = require("express");
const { config } = require("dotenv").config();
const sequelize = require("./utils/dbConn");
const bodyParser = require("body-parser");
const path = require("node:path");
const app = express();
const userRoute = require("./routers/userRoute");
const expenseRoute = require("./routers/expenseRoute");
const PORT_NUMBER = process.env.PORT_NUMBER || 4300;

//Imports for Models
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/", userRoute);
app.use("/user", userRoute);
app.use("/expense", expenseRoute);


//Relationship among the tables
User.hasMany(Expense);
Expense.belongsTo(User);

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
