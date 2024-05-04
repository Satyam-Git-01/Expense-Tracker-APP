const Sequelize= require('sequelize')
const sequelize = require('../utils/dbConn')

const expenseModel= sequelize.define('expenses',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    amount: Sequelize.INTEGER,
    description: Sequelize.STRING,
    category:Sequelize.STRING
})

module.exports= expenseModel