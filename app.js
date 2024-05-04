const express = require("express");
const { config } = require("dotenv").config();
const sequelize = require("./utils/dbConn");
const bodyParser= require('body-parser')
const path = require("node:path");
const app = express();
const userRoute = require("./routers/userRoute");
const expenseRoute = require('./routers/expenseRoute')
const PORT_NUMBER = process.env.PORT_NUMBER || 4300;

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static("public"));

app.use('/',userRoute)
app.use('/user',userRoute)
app.use('/expense',expenseRoute)

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
