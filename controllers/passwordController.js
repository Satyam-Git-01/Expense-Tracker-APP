const path = require("path");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const userModel = require("../models/userModel");
const ResetPasswordModel = require("../models/resetPasswordModel");
const getForgotPasswordPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "forgot.html"));
};

const sendMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetId = uuidv4();
    const resetUser = await userModel.findOne({ where: { email: email } });
    console.log(resetUser);
    if (!resetUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Exist! Try correct Email" });
    }
    const resetDataResult = await ResetPasswordModel.create({
      id: resetId,
      isActive: true,
      userId: resetUser.id,
    });
    //SIB Code
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "satyamchoudhary680@gmail.com",
      name: "Satyam Choudhary",
    };
    const receivers = [
      {
        email: email,
      },
    ];
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Reset Password Expense Tracker APP",
      textContent: "link below",
      htmlContent: `<h4>Dear ${resetUser.name}</h4>
      <br/>
      <p>It seems you have forgotten your password. Please <a href="http://localhost:5800/password/resetPasswordPage/{{params.requestId}}"> Click Here</a> to reset your password. Your password should have 8 or more characters with at least one uppercase letter, lowercase letter, number and special character. Please note that this link will expire in 24 hours.</p>
    <br/>
        <p>Thanks & Best Regards,
        <br/>
        Satyam Choudhary</p>`,
      params: {
        requestId: resetId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Link for reset the password is successfully send on your mail",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: true, message: "Shit Happened" });
  }
};
module.exports = {
  getForgotPasswordPage,
  sendMail,
};
