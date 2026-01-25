const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/cart/:userId", cartController.getCartForUser);
router.post("/cart/:userId", cartController.addProductToCart);

module.exports = router;
