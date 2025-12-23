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
  console.log("req.user:", req.user);

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This is not the path to update passwords", 400));
  }

  const filteredBody = filterObj(req.body, "name", "email");
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
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
}

exports.getUser = getOne(User);
exports.getAllUsers = getAll(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
