const CustomField = require("../models/CustomField");
const Store = require("../models/Store");

exports.createField = async (req, res) => {
  try {

    const {
      fieldName,
      fieldType,
      options,
      isRequired
    } = req.body;

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const field = await CustomField.create({
      storeId: store._id,
      fieldName,
      fieldType,
      options,
      isRequired
    });

    res.status(201).json({
      success: true,
      field
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getFields = async (req, res) => {
  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const fields = await CustomField.find({
      storeId: store._id
    });

    res.json({
      success: true,
      fields
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.updateField = async (req, res) => {
  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const field = await CustomField.findOneAndUpdate(
      {
        _id: req.params.id,
        storeId: store._id
      },
      req.body,
      {
        new: true
      }
    );

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found"
      });
    }

    res.json({
      success: true,
      field
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.deleteField = async (req, res) => {
  try {

    const store = await Store.findOne({
      ownerId: req.user.id
    });

    const field = await CustomField.findOneAndDelete({
      _id: req.params.id,
      storeId: store._id
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found"
      });
    }

    res.json({
      success: true,
      message: "Field deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};