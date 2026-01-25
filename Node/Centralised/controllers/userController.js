const userService = require("../services/userService");

const getAllUsers = (req, res, next) => {
    try {
        res.send(userService.getAllUsers());
    } catch (err) {
        next(err);
    }
};

const getUserById = (req, res, next) => {
    try {
        res.send(userService.getUserById(req.params.id));
    } catch (err) {
        next(err);
    }
};

const addUser = (req, res, next) => {
    try {
        res.send(userService.addUser());
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllUsers, getUserById, addUser };
