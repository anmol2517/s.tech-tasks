const express = require('express');
const app = express();
const studentRoutes = require('./routes/students');

app.use(express.json());
app.use('/students', studentRoutes);

app.listen(3000);
