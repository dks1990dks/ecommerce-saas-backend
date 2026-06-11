const mongoose = require("mongoose");

const customFieldSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },

    fieldName: {
      type: String,
      required: true,
      trim: true
    },

    fieldType: {
      type: String,
      enum: [
        "text",
        "number",
        "textarea",
        "select",
        "date",
        "boolean"
      ],
      default: "text"
    },

    options: [String],

    isRequired: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "CustomField",
  customFieldSchema
);