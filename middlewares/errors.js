const ErrorHandler = require("../util/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    //Wrong mongoose object id error
    if (err.name == "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    //handling mongoose validation error
    if (err.name == "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    //Handling mongoose Duplicate keys error
    if (err.code == 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    //Handling wrong jwt error
    if (err.name === "JsonWebTokenError") {
      const message = "Json Web Token is invalid. Try Again!";
      error = new ErrorHandler(message, 400);
    }

    //Handling Expired jwt error
    if (err.name === "TokenExpireError") {
      const message = "Json Web Token is expired. Try Again!";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
