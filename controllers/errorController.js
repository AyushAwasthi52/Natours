const sendErrorDev = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Soemthing went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};
