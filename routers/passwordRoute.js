const express = require("express");
const { getForgotPasswordPage ,sendMail} = require("../controllers/passwordController");

const passwordRoute = express.Router();

passwordRoute.get("/forgotPasswordPage",getForgotPasswordPage);
passwordRoute.post('/sendResetPasswordMail',sendMail)

module.exports = passwordRoute;
