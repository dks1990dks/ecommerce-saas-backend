const Product = require("../models/Product");
const Store = require("../models/Store");

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
      `https://chipper-muffin-64e992.netlify.app/store/${storeSlug}/product/${productSlug}`;

    const image =
      product.images?.[0] || "";

    res.send(`
<!DOCTYPE html>
<html>
<head>

<title>${product.productName}</title>

<meta property="og:type" content="product" />
<meta property="og:title" content="${product.productName}" />
<meta property="og:description" content="${product.description || ""}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${frontendUrl}" />

<meta property="og:site_name" content="${store.storeName}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${product.productName}" />
<meta name="twitter:description" content="${product.description || ""}" />
<meta name="twitter:image" content="${image}" />

</head>

<body>

<script>
window.location.href="${frontendUrl}";
</script>

</body>
</html>
`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};