const jwt = require("jsonwebtoken");
const Store = require("../models/Store"); // 1. Import the Store model

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // 2. Automatically look up the store for this user
    const store = await Store.findOne({ ownerId: decoded.id });
    
    // 3. Attach it to the request object so any route can use it instantly
    req.store = store; 

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};