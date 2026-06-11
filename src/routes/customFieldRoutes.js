const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createField,
  getFields,
  updateField,
  deleteField
} = require("../controllers/customFieldController");

router.post("/", auth, createField);

router.get("/", auth, getFields);

router.put("/:id", auth, updateField);

router.delete("/:id", auth, deleteField);

module.exports = router;