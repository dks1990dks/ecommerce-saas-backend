const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createStore,
  getMyStore,
  getStoreBySlug,
  updateStore,
} = require("../controllers/storeController");

router.post("/", auth, createStore);

router.get("/me", auth, getMyStore);

router.get("/:slug", getStoreBySlug);
router.put("/me", auth, updateStore);

module.exports = router;
