const Tour = require("./../models/tourModel");
const APIFeaures = require("./../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  const url = new URL(req.originalUrl, `http://${req.headers.host}`);

  url.searchParams.set("limit", "5");
  url.searchParams.set("sort", "-ratingsAverage,price");
  url.searchParams.set("fields", "name,price,ratingsAverage");

  req.url = url.pathname + url.search;

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeaures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: newTour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Invalid Data",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMonthlyPlans = async (req, res) => {
  try {
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
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id'},
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
