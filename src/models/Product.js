const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },

    productName: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String
    },

    description: {
      type: String,
      default: ""
    },

    images: {
      type: [String],
      default: []
    },

    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },

    views: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);