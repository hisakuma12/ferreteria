//Send token an save in the cookies
const sendToken = (user, statusCode, res) => {
  //Create Jwt token
  const token = user.getJwtToken();

  //option for cookies
  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
