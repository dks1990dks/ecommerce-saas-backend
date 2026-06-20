const Product = require("../models/Product");
const Store = require("../models/Store");
const { escapeHtml, optimizeImageUrl, generateOGTags, generateTwitterTags } = require("../utils/htmlUtils");

exports.productSharePage = async (req, res) => {
  console.log("=== SHARE REQUEST ===");
  console.log("UA:", req.headers["user-agent"]);
  console.log("Store:", req.params.storeSlug);
  console.log("Product:", req.params.productSlug);

  try {
    const { storeSlug, productSlug } = req.params;

    const store = await Store.findOne({
      slug: storeSlug,
    });

    if (!store) {
      return res.status(404).send("Store not found");
    }

    const product = await Product.findOne({
      storeId: store._id,
      slug: productSlug,
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const frontendUrl =
      `https://dks1990dks.github.io/mvpstore/#/store/${storeSlug}/product/${productSlug}`;

    const shareUrl =
      `https://ecommerce-saas-backend.onrender.com/share/product/${storeSlug}/${productSlug}`;

    const image = product.images?.[0] || "";

    // Prepare meta tag data
    const metaData = {
      title: product.productName,
      description: product.description || "Check out our latest products",
      image: image,
      url: shareUrl,
      siteName: store.storeName
    };

    const ogTags = generateOGTags(metaData);
    const twitterTags = generateTwitterTags(metaData);
    const escapedProductName = escapeHtml(product.productName);
    const escapedStoreName = escapeHtml(store.storeName);

    // Set cache headers - crawlers will cache the preview
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.setHeader('X-Robots-Tag', 'noindex');

    console.log("PRODUCT:", product.productName);
console.log("IMAGE:", image);
console.log("FRONTEND URL:", frontendUrl);
console.log("STORE:", store.storeName);
console.log("OG TAGS:", ogTags);
    res.status(200);
res.set("Cache-Control", "public, max-age=3600");

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />

  <title>${escapedProductName} | ${escapedStoreName}</title>

  <meta name="description" content="${escapeHtml(product.description || "Check out our latest products")}" />
  <meta name="author" content="${escapedStoreName}" />
  <meta name="keywords" content="${escapedProductName}, shop, products" />

  ${ogTags}

  ${twitterTags}

  <meta property="product:price:currency" content="USD" />
  <meta property="product:category" content="${escapedStoreName}" />

  <link rel="preload" as="image" href="${optimizeImageUrl(image)}" />

  <meta http-equiv="refresh" content="3;url=${frontendUrl}" />

  <script>
    setTimeout(function() {
      window.location.href = "${frontendUrl}";
    }, 3000); // 3000 milliseconds = 3 seconds
  </script>

  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f9fafb;
      color: #1f2937;
    }
    .container {
      text-align: center;
    }
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="spinner"></div>
    <h1>Opening ${escapedProductName}...</h1>
    <p>Taking you to ${escapedStoreName} in a moment.</p>
    <p><small>Taking too long? <a href="${frontendUrl}">Click here to open immediately</a></small></p>
  </div>
</body>
</html>
`);
  } catch (err) {
    console.error("Share page error:", err);
    res.status(500).send("Server Error");
  }
};
