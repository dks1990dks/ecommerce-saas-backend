const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.post("/", auth, createProduct);

router.get("/", auth, getProducts);

router.get("/:id", auth, getProduct);

router.put("/:id", auth, updateProduct);

router.delete("/:id", auth, deleteProduct);

module.exports = router;