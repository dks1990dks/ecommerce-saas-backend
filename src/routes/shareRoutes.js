const express = require("express");
const router = express.Router();

const {
  productSharePage,
} = require("../controllers/shareController");

router.get(
  "/product/:storeSlug/:productSlug",
  productSharePage
);

module.exports = router;