const AppError = require(".././utils/appError");
const catchAsync = require(".././utils/catchAsync");
const APIFeaures = require("./../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No doc by the id", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No doc by the id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        Model: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, queryOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (queryOptions) query.populate(queryOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No doc by the id", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeaures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const Models = await features.query;

    res.status(200).json({
      status: "success",
      results: Models.length,
      data: {
        Models,
      },
    });
  });
