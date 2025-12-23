const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handleFactory");

exports.aliasTopTours = (req, res, next) => {
  const url = new URL(req.originalUrl, `http://${req.headers.host}`);

  url.searchParams.set("limit", "5");
  url.searchParams.set("sort", "-ratingsAverage,price");
  url.searchParams.set("fields", "name,price,ratingsAverage");

  req.url = url.pathname + url.search;

  next();
};

exports.getAllTours = getAll(Tour);

exports.getTour = getOne(Tour, { path: "reviews" });

exports.createTour = createOne(Tour);

exports.updateTour = updateOne(Tour);

exports.deleteTour = deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        averageRating: { $avg: "$ratingsAverage" },
        averagePrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlans = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: "$startDates" },
        numTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTours: -1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
