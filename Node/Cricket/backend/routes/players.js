const e=require("express")
const d=require("../db")
const r=e.Router()

r.post("/",async(q,s)=>{
const{name,matches,runs,centuries,profile}=q.body
const[i]=await d.execute(
"insert into players values(null,?,?,?,?,?)",
[name,matches,runs,centuries,profile]
)
s.json({id:i.insertId})
})

r.get("/",async(q,s)=>{
const[x]=await d.execute("select * from players")
s.json(x)
})

r.get("/search",async(q,s)=>{
const[x]=await d.execute(
"select * from players where name like ?",
[`%${q.query.q}%`]
)
s.json(x)
})

r.get("/:id",async(q,s)=>{
const[x]=await d.execute("select * from players where id=?", [q.params.id])
s.json(x[0])
})

r.put("/:id",async(q,s)=>{
const{name,matches,runs,centuries,profile}=q.body
await d.execute(
"update players set name=?,matches=?,runs=?,centuries=?,profile=? where id=?",
[name,matches,runs,centuries,profile,q.params.id]
)
s.json({ok:true})
})

r.delete("/:id",async(q,s)=>{
await d.execute("delete from players where id=?", [q.params.id])
s.json({ok:true})
})

r.get("/leaderboard/top",async(q,s)=>{
const[x]=await d.execute(
"select name,runs,centuries from players order by runs desc limit 5"
)
s.json(x)
})

module.exports=r
