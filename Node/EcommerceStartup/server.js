const express = require("express")
const app = express()

const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")

app.use("/users", userRoutes)
app.use("/products", productRoutes)
app.use("/cart", cartRoutes)

app.listen(3000, () => {
  console.log("Server started on port 3000")
})

/*
Browser URLs to test the routes
http://localhost:3000/users
http://localhost:3000/products
http://localhost:3000/cart/1
*/
