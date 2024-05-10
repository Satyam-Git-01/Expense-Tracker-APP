const resetBtn = document.getElementById('resetbtn')
async function forgotPasswordSendMail(event) {
  event.preventDefault();
  try {
    const email = event.target.email.value;
    const result = await axios.post(
      "http://localhost:5800/password/sendResetPasswordMail",
      { email }
    );
  } catch (err) {
    console.log(err);
  }
}
