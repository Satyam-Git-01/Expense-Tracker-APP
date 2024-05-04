const express = require("express");
const {config} = require("dotenv").config();
const dbConnection = require("./utils/dbConn");

const app = express();



const PORT_NUMBER = process.env.PORT_NUMBER || 4300;
app.listen(PORT_NUMBER, () => {
    console.log(`APP URL http://localhost:${PORT_NUMBER}`);
  });

dbConnection
  .sync()
  .then((resp) => {
    console.log(resp)
   
  })
  .catch((err) => {
    console.log(err)
  });
