const Store = require("../models/Store");
const Product = require("../models/Product");
const Category = require("../models/Category");
const StoreAnalytics =
require("../models/StoreAnalytics");

exports.getDashboard = async (
  req,
  res
) => {

  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    if (!store) {
      return res.status(404).json({
        success: false
      });
    }

    const totalProducts =
      await Product.countDocuments({
        storeId: store._id
      });

    const totalCategories =
      await Category.countDocuments({
        storeId: store._id
      });

    const analytics =
      await StoreAnalytics.findOne({
        storeId: store._id
      });

      const activeProducts =
await Product.countDocuments({
  storeId: store._id,
  isActive: true
});

const inactiveProducts =
await Product.countDocuments({
  storeId: store._id,
  isActive: false
});

const latestProducts = await Product.find({
  storeId: store._id
})
.select("productName images createdAt slug")
.sort({ createdAt: -1 })
.limit(5);

const topProduct = await Product.findOne({
  storeId: store._id
})
.select("productName images views slug")
.sort({ views: -1 });



    res.json({
      success: true,

      storeName: store.storeName,

      totalProducts,
      activeProducts,
      inactiveProducts,

      totalCategories,

      totalViews:
        analytics?.totalViews || 0,
      topProduct,
      latestProducts
    });
    


  } catch (error) {

    res.status(500).json({
      success: false
    });
  }
};

exports.getTopProducts = async (
  req,
  res
) => {

  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const products =
      await Product.find({
        storeId: store._id
      })
        .sort({ views: -1 })
        .limit(10);

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

