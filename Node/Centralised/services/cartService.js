const getCartForUser = (userId) => {
    if (!userId) {
        const error = new Error("User ID is required");
        error.statusCode = 400;
        throw error;
    }
    return `Fetching cart for user with ID: ${userId}`;
};

const addProductToCart = (userId) => {
    if (!userId) {
        const error = new Error("User ID is required");
        error.statusCode = 400;
        throw error;
    }
    return `Adding product to cart for user with ID: ${userId}`;
};

module.exports = { getCartForUser, addProductToCart };
