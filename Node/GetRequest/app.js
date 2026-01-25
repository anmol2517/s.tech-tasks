const express = require("express");
const path = require("path");

const app = express();

app.get("/api/products", (req, res) => {
    res.sendFile(path.join(__dirname, "view", "products.html"));
});

app.listen(3000);
console.log("Server is running on http://localhost:3000");
