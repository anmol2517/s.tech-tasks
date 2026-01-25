const express = require("express");
const app = express();

app.get("/welcome/:username", (req, res) => {
  const username = req.params.username;
  const role = req.query.role;
  res.send(`Welcome ${username}, your role is ${role}`);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});


// Test (Postman / Browser)

//  http://localhost:3000/welcome/Julian?role=Admin

// http://localhost:3000/welcome/Anmol?role=User

