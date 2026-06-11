const mongoose = require("mongoose");

const inquirySchema =
new mongoose.Schema(
{
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  source: {
    type: String,
    default: "whatsapp"
  }
},
{
  timestamps: true
});

module.exports =
mongoose.model(
  "Inquiry",
  inquirySchema
);