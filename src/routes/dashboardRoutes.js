const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const {
  getDashboard,
  getTopProducts
} =
require("../controllers/dashboardController");

router.get(
  "/",
  auth,
  getDashboard
);

router.get(
  "/top-products",
  auth,
  getTopProducts
);

module.exports = router;