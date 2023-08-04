const express = require("express");
const router = express.Router();

const premiumFeatureController = require("../controllers/premiumFeature");

const authenticateMiddleware = require("../middlewares/auth");

router.get(
  "/showLeaderBoard",
  authenticateMiddleware.authenticate,
  premiumFeatureController.getUserLeaderBoard
);

router.get(
  "/periodicExpenses",
  authenticateMiddleware.authenticate,
  premiumFeatureController.periodicExpenses
);

module.exports = router;
