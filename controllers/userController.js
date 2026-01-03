const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const { deleteOne, updateOne, getOne, getAll } = require("./handleFactory");

const filterObj = (object, ...fields) => {
  const newObj = {};
  Object.keys(object).forEach((el) => {
    if (fields.includes(el)) newObj[el] = object[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log("BODY:", req.body);

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates.", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");
  console.log(filteredBody, "Filtered");

  if (!filteredBody.name || !filteredBody.email) {
    return next(new AppError("Please provide both name and email", 400));
  }

  const user = await User.findById(req.user.id);
  console.log(user, "User");

  user.name = filteredBody.name;
  user.email = filteredBody.email;

  await user.save({ validateModifiedOnly: true });

  console.log(user, "user");

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Use signup",
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = getOne(User);
exports.getAllUsers = getAll(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
