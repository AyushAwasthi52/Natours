const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/me")
  .get(authController.protect, userController.getMe, userController.getUser);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/update-password", authController.updatePassword);
router.patch("/update-me", userController.updateMe);
router.delete("/delete-me", userController.deleteMe);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
