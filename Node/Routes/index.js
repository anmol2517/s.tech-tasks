const express = require("express");
const app = express();
const PORT = 3000;


// Middleware to parse JSON (for POST requests)

app.use(express.json());


// GET 

app.get("/orders", (req, res) => {
  res.send("Here is the list of all orders.");
});

// POST

app.post("/orders", (req, res) => {
  res.send("A new order has been created.");
});


// GET

app.get("/users", (req, res) => {
  res.send("Here is the list of all users.");
});

// POST

app.post("/users", (req, res) => {
  res.send("A new user has been added.");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/*

Open browser and hit:

http://localhost:3000/orders
-- Here is the list of all orders.

http://localhost:3000/users
--  Here is the list of all users.

Postman or curl for POST requests:

http://localhost:3000/orders
-- A new order has been created.

http://localhost:3000/users
-- A new user has been added.

*/