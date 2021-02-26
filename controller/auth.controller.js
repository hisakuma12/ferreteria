const Usuario = require("../models/Usuario");

const ErrorHandler = require("../util/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../util/jwtToken");
const sendEmail = require("../util/sendEmail");
const crypto = require("crypto");

//TODO Registrar usuario -> api/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await Usuario.create({
    name,
    email,
    password,
    avatar: {
      public_id: "",
      url: "",
    },
  });

  sendToken(user, 200, res);
});

//TODO Login Usuario -> api/login
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const user = await Usuario.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//TODO Logout Usuario -> api/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//TODO Forgot password -> api/reset
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await Usuario.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //create reset Password Token
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf yout have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//TODO Reset password -> api/reset:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  console.log(req.params.token);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Usuario.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();

  sendToken(user, 200, res);
});

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await Usuario.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await Usuario.findById(req.user.id).select("+password");

  const isMatched = await user.comparePassword(req.body.oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("Old Password is incorrect"), 400);
  }

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await Usuario.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Admin route
//Get All User -> api/admin/allUsers

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await Usuario.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//Get Single User -> api/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await Usuario.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//Update Single User -> api/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await Usuario.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Delete User -> api/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await Usuario.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not found with id: ${req.params.id}`)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
