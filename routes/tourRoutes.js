const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/tour-stats")
  .get(
    authController.protect,
    authController.restrictTo("admin", "guide", "lead-guide"),
    tourController.getTourStats
  );
router
  .route("/monthly-plans/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "guide", "lead-guide"),
    tourController.getMonthlyPlans
  );

router
  .route("/top-5-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route("/tours-within/distance/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router
  .route("/distances/:latlng/unit/:unit")
  .get(tourController.getDistances);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
