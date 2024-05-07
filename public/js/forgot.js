async function forgotPasswordSendMail(event) {
  event.preventDefault();
  try {
    const email = event.target.email.value;
    console.log(email);
    const result = await axios.post(
      "http://localhost:5800/password/sendResetPasswordMail",
      { email }
    );
    console.log(result.data.message);
    //window.location.href = "/";
  } catch (err) {
    console.log(err);
  }
}
