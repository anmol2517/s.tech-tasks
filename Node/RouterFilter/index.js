const express = require('express');
const app = express();
const PORT = 4000;

// Import routers

const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');

// Logging middleware

app.use((req, res, next) => {
  console.log(`${req.method} request made to ${req.url}`);
  next();
});

// Use routers

app.use('/products', productRouter);
app.use('/categories', categoryRouter);

// Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

