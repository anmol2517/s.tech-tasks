const productService = require("../services/productService");

const getAllProducts = (req, res) => {
    res.send(productService.getAllProducts());
};

const getProductById = (req, res) => {
    res.send(productService.getProductById(req.params.id));
};

const addProduct = (req, res) => {
    res.send(productService.addProduct());
};

module.exports = { getAllProducts, getProductById, addProduct };
