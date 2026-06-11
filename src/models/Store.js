const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    storeName: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      unique: true
    },

    logo: String,

    banner: String,

    whatsappNumber: String,

    address: String,

    socialLinks: {
      facebook: String,
      instagram: String,
      youtube: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Store", storeSchema);