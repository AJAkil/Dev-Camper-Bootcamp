const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  let statusCode = 500;
  let message = '';

  error.message = err.message;

  // Log to console for dev
  //console.log('pera?',err);

  // Mongoose bad objectId
  if (err.name === "CastError") {
    message = `Bootcamp not found with the id ${err.value}`;
    statusCode = 404
  }

  // Mongoose duplicate key error
  if (err.code === 11000){
      message = `Duplicate Field Value Entered`
      statusCode = 400
  }

  // Mongoose validation error
  if (err.name === 'ValidationError'){
      message = Object.values(err.errors).map(val => val.message)
      statusCode = 400;
  }

  //error = new ErrorResponse(message, statusCode);

  res.status(error.statusCode || 404).json({
    success: false,
    error: error.message || "General Error",
  });
};

module.exports = errorHandler;
