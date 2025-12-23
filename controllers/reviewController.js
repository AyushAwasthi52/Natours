const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handleFactory.js");

exports.updateUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

exports.getAllReviews = getAll(Review);

exports.getReview = getOne(Review);

exports.createReview = createOne(Review);

exports.deleteReview = deleteOne(Review);

exports.updateReview = updateOne(Review);
