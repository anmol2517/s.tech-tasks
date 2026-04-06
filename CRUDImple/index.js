const express = require('express');
const app = express();

const studentRouter = require('./routes/studentRoutes');
const courseRouter = require('./routes/courseRoutes');

app.get('/', (req, res) => {
  res.send("Welcome to the Student & Course Portal API!");
});

app.use('/students', studentRouter);
app.use('/courses', courseRouter);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
