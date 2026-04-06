const express = require("express")
const cors = require("cors")
const players = require("./routes/players")

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/live", (req, res) => {
  res.json({
    team1: "India",
    team2: "England",
    score1: "278/5",
    score2: "Yet to bat",
    overs: "46.2"
  })
})

app.use("/players", players)

app.listen(3000)
