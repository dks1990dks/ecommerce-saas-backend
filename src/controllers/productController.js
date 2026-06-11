const Product = require("../models/Product");
const Store = require("../models/Store");
const Category = require("../models/Category");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
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

    const {
      productName,
      description,
      categoryId,
      images,
      customFields
    } = req.body;

    const category = await Category.findOne({
      _id: categoryId,
      storeId: store._id
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      });
    }

    let slug = slugify(productName, {
      lower: true,
      strict: true
    });

    const exists = await Product.findOne({
      slug
    });

    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await Product.create({
      storeId: store._id,
      categoryId,
      productName,
      slug,
      description,
      images,
      customFields
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getProducts = async (req, res) => {
  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const products = await Product.find({
      storeId: store._id
    })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getProduct = async (req, res) => {
  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const product = await Product.findOne({
      _id: req.params.id,
      storeId: store._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const product =
      await Product.findOneAndUpdate(
        {
          _id: req.params.id,
          storeId: store._id
        },
        req.body,
        {
          new: true
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const product =
      await Product.findOneAndDelete({
        _id: req.params.id,
        storeId: store._id
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

