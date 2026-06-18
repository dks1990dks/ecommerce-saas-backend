const express = require("express");
const cors = require("cors");
const app = express();

// 1. GLOBAL MIDDLEWARES (Must come first!)
app.use(cors());
app.use(express.json()); // <--- This parses JSON bodies!
app.use(express.urlencoded({ extended: true })); // Good to have for form-data

// 2. ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/store", require("./routes/storeRoutes"));
app.use("/api/categories",require("./routes/categoryRoutes"));
app.use("/api/fields",require("./routes/customFieldRoutes"));
app.use("/api/products",require("./routes/productRoutes"));
app.use("/api/public",require("./routes/publicRoutes"));
app.use("/api/upload",require("./routes/uploadRoutes"));
app.use("/api/dashboard",require("./routes/dashboardRoutes"));
app.use("/api/public/inquiry",require("./routes/inquiryRoutes"));

const shareRoutes = require("./routes/shareRoutes");

app.use("/share", shareRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce SaaS Backend is running"
  });
});

app.get("/fb-test", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="FB Test">
        <meta property="og:description" content="Testing">
      </head>
      <body>OK</body>
    </html>
  `);
});

app.get("/ua-test", (req, res) => {
  res.json({
    userAgent: req.headers["user-agent"],
    ip: req.ip
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});



module.exports = app;
