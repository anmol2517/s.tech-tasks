const cartService = require("../services/cartService");

const getCartForUser = (req, res, next) => {
    try {
        res.send(cartService.getCartForUser(req.params.userId));
    } catch (err) {
        next(err);
    }
};

const addProductToCart = (req, res, next) => {
    try {
        res.send(cartService.addProductToCart(req.params.userId));
    } catch (err) {
        next(err);
    }
};

module.exports = { getCartForUser, addProductToCart };
