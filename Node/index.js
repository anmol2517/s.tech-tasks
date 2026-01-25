const express = require("express");
const app = express();
const PORT = 3000;


/* 
=========================
   Custom Middleware
========================= 
*/

const addUserMiddleware = (req, res, next) => {
  req.user = "Guest";   
  next();           
};


/* 
=========================
   Route using Middleware
========================= 
*/

app.get("/welcome", addUserMiddleware, (req, res) => {
  res.send(`<h1>Welcome, ${req.user}!</h1>`);
});



/* 
=========================
   Server
========================= 
*/

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//  http://localhost:3000/welcome