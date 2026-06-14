const Product = require("../models/Product");
const Store = require("../models/Store");
const { escapeHtml, optimizeImageUrl, generateOGTags, generateTwitterTags } = require("../utils/htmlUtils");

exports.productSharePage = async (req, res) => {
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

<!-- Open Graph Meta Tags for Facebook, WhatsApp, Telegram -->
${ogTags}

<!-- Twitter Card Meta Tags -->
${twitterTags}

<!-- Additional Meta Tags for better crawling -->
<meta property="product:price:currency" content="USD" />
<meta property="product:category" content="${escapedStoreName}" />

<!-- Preload critical image for faster loading -->
<link rel="preload" as="image" href="${optimizeImageUrl(image)}" />

<!-- Redirect to frontend after meta tags are read (2 second delay for crawlers) -->
<meta http-equiv="refresh" content="2;url=${frontendUrl}" />

</head>

<body>

<p>Redirecting you to the product page...</p>

<script>
// Delay redirect to ensure crawlers can read meta tags
setTimeout(function() {
  window.location.replace("${frontendUrl}");
}, 2100);
</script>

</body>
</html>
`);
  } catch (err) {
    console.error("Share page error:", err);
    res.status(500).send("Server Error");
  }
};
