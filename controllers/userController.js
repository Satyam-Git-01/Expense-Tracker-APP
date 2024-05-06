const path = require("path");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateAccessToken = (id, email) => {
  return jwt.sign({ userId: id, email: email }, process.env.JWT_TOKEN);
};
const handleSignUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      const result = await userModel.create({ name, email, password: hash });
    });
    return res
      .status(201)
      .json({ sucess: true, message: "user created successfully" });
  } catch (err) {
    if (err.errors[0].type === "unique violation") {
      return res
        .status(500)
        .json({ success: false, message: "User Already Exists." });
    } else {
      return res.status(500).json({
        success: false,
        message: "Something Happend While Creating User",
      });
    }
  }
};

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await userModel.findOne({ where: { email: email } });

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ sucess: false, message: "Error Occured" });
      } else if (result == true) {
        return res.status(200).json({
          success: true,
          message: "Login Sucessfull",
          token: generateAccessToken(user.id, user.email),
        });
      } else {
        return res
          .status(400)
          .json({ sucess: false, message: "Incorrect Password" });
      }
    });
  } catch (err) {
    console.log(err);
    res.send(500);
  }
};
const handleLoginPage = (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
  } catch (error) {
    console.log(error);
  }
};
const isPremiumUser = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ where: { id: req.user.id } });
    if (user.isPremiumUser == 1) {
      return res.status(200).send(user);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = {
  handleSignUp,
  handleLoginPage,
  handleLogin,
  generateAccessToken,
  isPremiumUser,
};
