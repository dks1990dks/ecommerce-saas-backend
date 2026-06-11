const Inquiry = require("../models/Inquiry");
const Product = require("../models/Product");

exports.createInquiry = async (req, res) => {
  try {

    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const inquiry = await Inquiry.create({
      storeId: product.storeId,
      productId,
      source: "whatsapp"
    });

    res.status(201).json({
      success: true,
      inquiry
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};