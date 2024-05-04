const express = require("express");
const { handleSignUp ,handleLoginPage,handleLogin} = require("../controllers/userController");
const userRoute = express.Router();

userRoute.use(express.static("public"))
userRoute.get('/',handleLoginPage)
userRoute.post("/signUp", handleSignUp);
userRoute.post("/login",handleLogin)

module.exports = userRoute
