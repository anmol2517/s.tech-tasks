const express = require("express");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(errorHandler);

app.listen(3000);
