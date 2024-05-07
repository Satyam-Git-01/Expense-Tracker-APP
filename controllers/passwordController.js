const path = require("path");
const getForgotPasswordPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "forgot.html"));
};

const sendMail = async (req, res, next) => {
  res.json({ success: true, message: "Reached" });
};
module.exports = {
  getForgotPasswordPage,
  sendMail,
};
