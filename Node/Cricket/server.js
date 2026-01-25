const express = require("express")
const players = require("./routes/players")

const app = express()
app.use(express.json())
app.use("/players", players)

app.listen(3000)
