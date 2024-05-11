const changePassword = async (event) => {
  event.preventDefault();
  try {
    const newPassword = event.target.newPassword.value;
    const result = await axios.post(
      "http://13.53.97.38:5800/password/updatePassword",
      {
        newPassword,
      }
    );
    window.location.href = "/";
  } catch (err) {
    console.log(err);
  }
};
