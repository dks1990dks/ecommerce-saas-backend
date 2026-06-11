const StoreAnalytics = require("../models/StoreAnalytics");
const Store = require("../models/Store");
const slugify = require("slugify");

exports.createStore = async (req, res) => {
  try {
    const { storeName, whatsappNumber, logo, banner, address } = req.body;

    // 1. Check if user already owns a store
    const existingStore = await Store.findOne({
      ownerId: req.user.id,
    });

    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "Store already exists",
      });
    }

    // 2. Generate initial slug (Changed to 'let' so it can be reassigned)
    let slug = slugify(storeName, {
      lower: true,
      strict: true,
    });

    // 3. Uniqueness Check: append timestamp if slug already exists in DB
    const exists = await Store.findOne({ slug });
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    // 4. Create the store
    const store = await Store.create({
      ownerId: req.user.id,
      storeName,
      slug,
      whatsappNumber,
      logo,
      banner,
      address,
    });

    res.status(201).json({
      success: true,
      store,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      ownerId: req.user.id,
    });

    res.json({
      success: true,
      store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.findOne({
      slug: req.params.slug,
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.json({
      success: true,
      store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate(
      { ownerId: req.user.id }, 
      req.body, 
      { returnDocument: 'after' } // Changed from { new: true }
    );
    
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }
    res.json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};