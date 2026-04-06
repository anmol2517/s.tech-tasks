const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.get("/api/products", (req, res) => {
    res.sendFile(path.join(__dirname, "view", "products.html"));
});

app.post("/api/products", (req, res) => {
    console.log(req.body);
    res.send(req.body.productName);
});

app.listen(3000);

