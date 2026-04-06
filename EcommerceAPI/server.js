const express = require("express")
const app = express()

const productRoutes = require("./routes/productRoutes")

app.use("/products", productRoutes)

app.listen(3000, () => {
  console.log("Server started on port 3000")
})

/*

----------Postman Test-----------

GET /products → Fetching all products
GET /products/1 → Fetching product with ID: 1
POST /products → Adding a new product

*/
