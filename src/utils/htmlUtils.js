/**
 * Utility functions for safe HTML rendering and social media optimization
 */

/**
 * Escapes HTML special characters to prevent XSS and meta tag breakage
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text safe for HTML attributes
 */
const escapeHtml = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Optimizes Cloudinary image URLs for social media sharing
 * Facebook, WhatsApp, and Telegram perform best with 1200x630px images
 * @param {string} imageUrl - The image URL to optimize
 * @param {object} options - Optional transformation options
 * @returns {string} - Optimized image URL
 */
const optimizeImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return "";
  
  // If it's already a Cloudinary URL, enhance it
  if (imageUrl.includes("res.cloudinary.com")) {
    if (!imageUrl.includes("/upload/")) {
      return imageUrl;
    }

    const {
      width = 1200,
      height = 630,
      crop = "fill",
      quality = "auto",
      format = "jpg",
      gravity = "auto"
    } = options;

    // Apply transformations for optimal social media preview
    return imageUrl.replace(
      "/upload/",
      `/upload/c_${crop},w_${width},h_${height},f_${format},q_${quality},g_${gravity}/`
    );
  }
  
  return imageUrl;
};

/**
 * Generates complete Open Graph meta tags for social sharing
 * @param {object} data - Product/page data
 * @returns {string} - HTML meta tags
 */
const generateOGTags = (data) => {
  const {
    title,
    description,
    image,
    url,
    siteName,
    type = "product", //  FIXED: Changed : to =
    locale = "en_US"
  } = data;

  const optimizedImage = optimizeImageUrl(image);
  console.log("OG IMAGE:", optimizedImage);

  return `
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${optimizedImage}" />
    <meta property="og:image:url" content="${optimizedImage}" />
    <meta property="og:image:secure_url" content="${optimizedImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="${escapeHtml(siteName)}" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
  `.trim();
};

/**
 * Generates Twitter Card meta tags
 * @param {object} data - Product/page data
 * @returns {string} - HTML meta tags
 */
const generateTwitterTags = (data) => {
  const {
    title,
    description,
    image,
    siteName
  } = data;

  const optimizedImage = optimizeImageUrl(image);

  return `
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${optimizedImage}" />
    <meta name="twitter:site_name" content="${escapeHtml(siteName)}" />
  `.trim();
};

module.exports = {
  escapeHtml,
  optimizeImageUrl,
  generateOGTags,
  generateTwitterTags
};
