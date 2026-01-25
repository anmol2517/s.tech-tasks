const express = require("express");
const app = express();

app.use(express.json());

app.get("/products", (req, res) => {
  res.send("Here is the list of all products.");
});

app.post("/products", (req, res) => {
  res.send("A new product has been added.");
});

app.get("/categories", (req, res) => {
  res.send("Here is the list of all categories.");
});

app.post("/categories", (req, res) => {
  res.send("A new category has been created.");
});

app.use((req, res) => {
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

/*

Test URLs

GET → http://localhost:4000/products

POST → http://localhost:4000/products

GET → http://localhost:4000/categories

POST → http://localhost:4000/categories

Undefined → http://localhost:4000/random → 404 page

*/
