const e=require("express")
const c=require("cors")
const app=e()

app.use(c())
app.use(e.json())
app.use("/api/players",require("./routes/players"))
app.use("/api/live",require("./routes/live"))

app.listen(4000)
console.log("Server started on port 4000")