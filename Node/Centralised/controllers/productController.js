const productService = require("../services/productService");

const getAllProducts = (req, res, next) => {
    try {
        res.send(productService.getAllProducts());
    } catch (err) {
        next(err);
    }
};

const getProductById = (req, res, next) => {
    try {
        res.send(productService.getProductById(req.params.id));
    } catch (err) {
        next(err);
    }
};

const addProduct = (req, res, next) => {
    try {
        res.send(productService.addProduct());
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllProducts, getProductById, addProduct };
