const express = require("express");
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/me", authController.protect, viewController.account);

router.use(authController.isLoggedIn);

router.get("/overview", viewController.getOverview);

router.get("/tour/:tour", viewController.getTour);

router.get("/login", viewController.login);

router.get("/", (req, res) => {
  res.status(200).render("base");
});

module.exports = router;
