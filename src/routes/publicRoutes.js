const express = require("express");

const router = express.Router();

const {
  getStorefront,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,  
  getProductDetail,
  getShareLinks,
  getRelatedProducts
} = require(
  "../controllers/publicController"
);

router.get(
  "/store/:slug",
  getStorefront
);

router.get(
  "/store/:storeSlug/product/:productSlug",
  getProductBySlug
);

router.get(
  "/store/:slug/category/:categoryId",
  getProductsByCategory
);

router.get(
  "/store/:slug/search",
  searchProducts
);

router.get(
  "/store/:storeSlug/product/:productSlug",
  getProductDetail
);

router.get(
  "/store/:storeSlug/product/:productSlug/share",
  getShareLinks
);

router.get(
  "/store/:storeSlug/product/:productSlug/related",
  getRelatedProducts
);

module.exports = router;