const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
} = require("../controllers/categoryController");

router.post("/", auth, createCategory);

router.get("/", auth, getCategories);

router.put("/:id", auth, updateCategory);

router.delete("/:id", auth, deleteCategory);

module.exports = router;