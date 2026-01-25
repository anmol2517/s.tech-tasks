const getAllUsers = () => {
    return "Fetching all users";
};

const getUserById = (id) => {
    if (!id) {
        const error = new Error("User ID is required");
        error.statusCode = 400;
        throw error;
    }
    return `Fetching user with ID: ${id}`;
};

const addUser = () => {
    return "Adding a new user";
};

module.exports = { getAllUsers, getUserById, addUser };
