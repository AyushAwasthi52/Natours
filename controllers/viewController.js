const AppError = require("../utils/appError");
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.tour }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  if (!tour) return next(new AppError("This path does not exist", 404));
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.login = (req, res) => {
  res.status(200).render("login", {
    page: "login",
  });
};

exports.account = (req, res) => {
  res.status(200).render("account", {
    page: "account",
  });
};
