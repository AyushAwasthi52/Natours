//review /rating /createdAt /ref to tour / ref to user
const mongoose = require("mongoose");
const Tour = require("./tourModel.js");

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

reviewSchema.statics.calcAverage = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        ratingsAverage: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].ratingsAverage,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.pre(/^findOneAnd/, async function () {
  this.r = this.findOne();
});

reviewSchema.post(/^findOneAnd/, function () {
  this.constructor.calcAverage(this.r.tour);
});

reviewSchema.post("save", function () {
  this.constructor.calcAverage(this.tour);
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
