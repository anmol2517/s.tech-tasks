const express = require('express');
const app = express();
const PORT = 3000;


// Middleware


app.use(express.json());


// Home Route

app.get('/', (req, res) => {
  res.send('<h1>Welcome to My Express Server!</h1>');
});


//  API Route

app.get('/api', (req, res) => {
  res.json({ message: "Hello from API" });
});


// Start 

app.listen(PORT, () => {
  console.log("Server is up and running on port 3000! Ready to handle requests.");
});


/*

Available Routes :

http://localhost:3000  :  Welcome message

http://localhost:3000/api  :  JSON response


*/