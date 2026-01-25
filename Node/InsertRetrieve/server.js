const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const busRoutes = require('./routes/buses');

app.use(express.json());
app.use('/users', userRoutes);
app.use('/buses', busRoutes);

app.listen(3000);
