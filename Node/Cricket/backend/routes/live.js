const e=require("express")
const d=require("../db")
const r=e.Router()

r.get("/",async(q,s)=>{
const[x]=await d.execute("select * from live_score limit 1")
s.json(x[0])
})

r.put("/",async(q,s)=>{
const{score1,score2,overs}=q.body
await d.execute(
"update live_score set score1=?,score2=?,overs=? where id=1",
[score1,score2,overs]
)
s.json({updated:true})
})

module.exports=r
