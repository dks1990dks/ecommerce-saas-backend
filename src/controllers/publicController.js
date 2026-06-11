const StoreAnalytics = require("../models/StoreAnalytics");
const Store = require("../models/Store");
const Category = require("../models/Category");
const Product = require("../models/Product");

exports.getStorefront = async (req, res) => {
  try {

    const { slug } = req.params;

    const store = await Store.findOne({
      slug
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    await StoreAnalytics.findOneAndUpdate(
      {
        storeId: store._id
      },
      {
        $inc: {
          totalViews: 1
        }
      },
      {
        upsert: true
      }
    );

    const categories = await Category.find({
      storeId: store._id,
      isActive: true
    });

    const products = await Product.find({
      storeId: store._id,
      isActive: true
    })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      store,
      categories,
      products
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { storeSlug, productSlug } = req.params;

    // 1. Find the store first
    const store = await Store.findOne({ slug: storeSlug });
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    // 2. Find the product belonging to this store
    const product = await Product.findOne({
      storeId: store._id,
      slug: productSlug,
      isActive: true
    }).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 3. Increment the product views safely in the background
    await Product.findByIdAndUpdate(
      product._id,
      { $inc: { views: 1 } },
      { new: true } // Ensures mongo updates it accurately
    );

    res.json({
      success: true,
      store,
      product
    });
  } catch (error) {
    // This will print the exact underlying issue to your server terminal terminal
    console.error("Error in getProductBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

exports.getProductsByCategory = async (
  req,
  res
) => {

  try {

    const { slug, categoryId } = req.params;

    const store = await Store.findOne({
      slug
    });

    const products = await Product.find({
      storeId: store._id,
      categoryId,
      isActive: true
    });

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });
  }
};

exports.searchProducts = async (
  req,
  res
) => {

  try {

    const { slug } = req.params;

    const { q } = req.query;

    const store = await Store.findOne({
      slug
    });

    const products = await Product.find({
      storeId: store._id,
      productName: {
        $regex: q,
        $options: "i"
      }
    });

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });
  }
};

exports.getProductDetail = async (req, res) => {
  try {

    const { storeSlug, productSlug } = req.params;

    const store = await Store.findOne({
      slug: storeSlug
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const product = await Product.findOne({
      storeId: store._id,
      slug: productSlug,
      isActive: true
    }).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await Product.findByIdAndUpdate(
      product._id,
      {
        $inc: {
          views: 1
        }
      }
    );

    res.json({
      success: true,
      store: {
        storeName: store.storeName,
        logo: store.logo,
        whatsappNumber: store.whatsappNumber
      },
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

exports.getShareLinks = async (
  req,
  res
) => {

  try {

    const { storeSlug, productSlug } =
      req.params;

    const store = await Store.findOne({
      slug: storeSlug
    });

    const product =
      await Product.findOne({
        storeId: store._id,
        slug: productSlug
      });

    if (!product) {
      return res.status(404).json({
        success: false
      });
    }

    const productUrl =
      `${process.env.FRONTEND_URL}/store/${storeSlug}/product/${productSlug}`;

    res.json({
      success: true,

      productUrl,

      whatsapp:
        `https://wa.me/?text=${encodeURIComponent(productUrl)}`,

      facebook:
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,

      telegram:
        `https://t.me/share/url?url=${encodeURIComponent(productUrl)}`,

      twitter:
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}`,

      copyLink:
        productUrl
    });

  } catch (error) {

    res.status(500).json({
      success: false
    });
  }
};

exports.getRelatedProducts = async (
  req,
  res
) => {
  try {

    const { storeSlug, productSlug } =
      req.params;

    const store = await Store.findOne({
      slug: storeSlug
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const currentProduct =
      await Product.findOne({
        storeId: store._id,
        slug: productSlug
      });

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let relatedProducts =
      await Product.find({
        storeId: store._id,
        categoryId: currentProduct.categoryId,
        _id: { $ne: currentProduct._id },
        isActive: true
      })
        .select(
          "productName slug images customFields views"
        )
        .limit(8);

    if (relatedProducts.length === 0) {

      relatedProducts =
        await Product.find({
          storeId: store._id,
          _id: { $ne: currentProduct._id },
          isActive: true
        })
          .limit(8);
    }


    res.json({
      success: true,
      relatedProducts
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};