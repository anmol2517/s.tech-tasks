const api="http://localhost:4000/api/players"

function load(){
fetch(api).then(r=>r.json()).then(d=>{
t.innerHTML=""
d.forEach(p=>{
t.innerHTML+=`
<tr>
<td>${p.name}</td>
<td>${p.runs}</td>
<td>
<button onclick="edit(${p.id},'${p.name}',${p.matches},${p.runs},${p.centuries},'${p.profile}')">Edit</button>
<button onclick="del(${p.id})">Delete</button>
<a href="player.html?id=${p.id}">View</a>
</td>
</tr>`
})
})
}

function save(){
const b={name:n.value,matches:m.value,runs:r.value,centuries:c.value,profile:p.value}
if(id.value)
fetch(api+"/"+id.value,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)})
else
fetch(api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)})
load()
}

function edit(i,nm,mm,rr,cc,pp){
id.value=i
n.value=nm
m.value=mm
r.value=rr
c.value=cc
p.value=pp
}

function del(i){
fetch(api+"/"+i,{method:"DELETE"}).then(load)
}

function search(){
fetch(api+"/search?q="+q.value).then(r=>r.json()).then(d=>{
t.innerHTML=""
d.forEach(p=>t.innerHTML+=`<tr><td>${p.name}</td><td>${p.runs}</td></tr>`)
})
}

load()
