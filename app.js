const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
//const mongoSanitizer = require("express-mongo-sanitize");
//const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true,
  })
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// 1) MIDDLEWARES
app.use(helmet());

//app.use(mongoSanitizer());
//app.use(xss());

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests try again in an hour",
});
app.use("/api", limit);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingQuantity",
      "ratingAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.set("query parser", "extended");

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/", viewRouter);

app.all(/.*/, (req, res) => {
  res.status(404).render("error", {
    title: "Page not found",
    msg: "The page you are looking for does not exist.",
  });
});

app.use("", (req, res, next) => {
  next(new AppError(`Cant find the path to ${req.originalUrl}`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
