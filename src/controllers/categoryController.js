const Category = require("../models/Category");
const Store = require("../models/Store");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    // Use req.store._id directly!
    const category = await Category.create({
      storeId: req.store._id, 
      name
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const store = await Store.findOne({
      ownerId: req.user.id
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const categories = await Category.find({
      storeId: store._id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // 1. Find the store owned by the current user
    const store = await Store.findOne({ ownerId: req.user.id });
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    // 2. Find the category ensuring it belongs to this specific store
    const category = await Category.findOne({
      _id: req.params.id,
      storeId: store._id
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or unauthorized access"
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // 1. Find the store owned by the current user
    const store = await Store.findOne({ ownerId: req.user.id });
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    // 2. Find and update the category ONLY if it belongs to this store
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, storeId: store._id },
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or unauthorized access"
      });
    }

    res.json({
      success: true,
      category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};