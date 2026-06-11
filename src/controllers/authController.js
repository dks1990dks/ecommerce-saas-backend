const User = require("../models/User");
const Store = require("../models/Store");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

exports.register = async (req, res) => {
  try {
    const { name, email, password, storeName, whatsappNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 1. Changed 'const' to 'let' so we can modify the slug if needed
    let slug = slugify(storeName, {
      lower: true,
      strict: true
    });

    // 2. --- ADDED THIS DUPLICATE CHECK HERE ---
    const existingStore = await Store.findOne({ slug });
    if (existingStore) {
      slug = `${slug}-${Date.now()}`; // Appends a unique timestamp if slug is taken
    }
    // ------------------------------------------

    // 3. The store will now save with either the clean slug or the unique timestamped slug
    const store = await Store.create({
      ownerId: user._id,
      storeName,
      slug,
      whatsappNumber
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user,
      store
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};