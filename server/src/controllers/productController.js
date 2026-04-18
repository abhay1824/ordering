const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isAvailable: true }).sort({
      category: 1,
      createdAt: 1,
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
};
