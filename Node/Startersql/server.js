const express = require('express');
const app = express();
const customerRoutes = require('./routes/customers');

app.use('/customers', customerRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
