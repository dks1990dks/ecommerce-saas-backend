const mongoose = require("mongoose");

const storeAnalyticsSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },

    totalViews: {
      type: Number,
      default: 0
    },

    totalProductViews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "StoreAnalytics",
  storeAnalyticsSchema
);