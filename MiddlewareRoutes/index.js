const express = require('express');
const app = express();
const PORT = 4000;

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request made to ${req.url}`);
  next();
});

// Routes
app.get('/products', (req, res) => {
  res.send("Here is the list of all products.");
});

app.post('/products', (req, res) => {
  res.send("A new product has been added.");
});

app.get('/categories', (req, res) => {
  res.send("Here is the list of all categories.");
});

app.post('/categories', (req, res) => {
  res.send("A new category has been created.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Testing the server :-------------
In Browser (GET requests only)

http://localhost:4000/products → "Here is the list of all products."

http://localhost:4000/categories → "Here is the list of all categories."

In Postman (GET & POST requests)

GET /products → same as above

POST /products → "A new product has been added."

GET /categories → "Here is the list of all categories."

POST /categories → "A new category has been created."

Check the console:
Every request you make will log something like:

GET request made to /products
POST request made to /categories

*/

