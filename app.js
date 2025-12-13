const express = require("express");
const morgan = require("morgan");
const qs = require("qs");

const AppError = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.set("query parser", "extended");

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use("", (req, res, next) => {
  next(new AppError(`Cant find the path to ${req.originalUrl}`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
