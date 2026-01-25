const getAllProducts = () => {
    return "Fetching all products";
};

const getProductById = (id) => {
    if (!id) {
        const error = new Error("Product ID is required");
        error.statusCode = 400;
        throw error;
    }
    return `Fetching product with ID: ${id}`;
};

const addProduct = () => {
    return "Adding a new product";
};

module.exports = { getAllProducts, getProductById, addProduct };
