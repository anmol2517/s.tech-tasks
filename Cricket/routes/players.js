const express = require("express")
const db = require("../db")
const router = express.Router()

router.get("/", async (req, res) => {
  const [r] = await db.query("select * from players")
  res.json(r)
})

router.post("/", async (req, res) => {
  const { name, country, matches, runs, centuries } = req.body
  const [r] = await db.query(
    "insert into players(name,country,matches,runs,centuries) values(?,?,?,?,?)",
    [name, country, matches, runs, centuries]
  )
  res.json({ id: r.insertId })
})

router.get("/search/:name", async (req, res) => {
  const [r] = await db.query(
    "select * from players where name like ?",
    [`%${req.params.name}%`]
  )
  res.json(r)
})

router.put("/:id", async (req, res) => {
  const { matches, runs, centuries } = req.body
  await db.query(
    "update players set matches=?,runs=?,centuries=? where id=?",
    [matches, runs, centuries, req.params.id]
  )
  res.json({ updated: true })
})

router.delete("/:id", async (req, res) => {
  await db.query("delete from players where id=?", [req.params.id])
  res.json({ deleted: true })
})

module.exports = router
