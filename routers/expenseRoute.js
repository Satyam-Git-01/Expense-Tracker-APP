const express= require('express')
const {getAllExpenses,getHomePage,addExpense} = require('../controllers/expenseController')
const expenseRoute= express.Router();

expenseRoute.get('/',getHomePage)
expenseRoute.get('/getAllExpenses',getAllExpenses)
expenseRoute.post('/addExpense',addExpense)

module.exports=expenseRoute