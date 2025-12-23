//review /rating /createdAt /ref to tour / ref to user
const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review should have a body"],
    },
    rating: {
      type: Number,
      required: [true, "A review should have a rating"],
      validate: {
        validator: function (val) {
          return val >= 0 && val <= 5;
        },
        message: "The value of review should be between 0 and 5",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must be by a user"],
    },
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function () {
  // this.populate({
  //   path: "tour",
  //   select: "name",
  // })
  this.populate({
    path: "user",
    select: "name photo",
  });
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
