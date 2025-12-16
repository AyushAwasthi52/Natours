const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  role: {
    type: String,
    enums: ["user", "admin", "guide", "lead-guide"],
    default: "user",
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Passwords should match"],
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtInitTimestamp) {
  if (this.passwordChangedAt) {
    const time = parseInt(passwordChangedAt.getTime() / 1000, 10);

    return time > jwtInitTimestamp;
  }

  return false;
};

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;