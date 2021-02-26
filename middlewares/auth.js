const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../util/errorHandler");
const Usuario = require("../models/Usuario");

//Check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this resours.", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await Usuario.findById(decode.id);

  next();
});

//Check if user is admin or not
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resours`,
          403
        )
      );
    }
    next();
  };
};
