import express from 'express'

const app= express();
const port=3000
app.use(express.json());
app.get("/", (req,res)=>{
    res.send("hello world")
})

let teas=[]
let nextId=1;
app.post("/tea",(req,res)=>{
    const {name,price}= req.body;
    const newTea= {id: nextId++ ,name,price}
    teas.push(newTea);
    res.status(200).send(newTea)
})
app.get("/tea",(req,res) => {
    res.status(200).send(teas);
})

app.get('/tea/:id',(req,res)=>{
    console.log(req.params);
    
    const tea=teas.find(t =>t.id ===parseInt(req.params.id))
    if(!tea)
    {
      return  res.status(404).send("not found")
    }
    res.status(200).send(tea);
})

app.put("/teas/:id",(req,res)=>{
    const tea = teas.find((t) => t.id === parseInt(req.params.id));
    if (!tea) {
     return res.status(404).send("not found");
    }
    const {name,price}=req.body;
    tea.name=name
    tea.price=price
    res.status(200).send(tea)
})

app.delete('/tea/:id',(req,res)=>{
    const index = teas.findIndex((t) => t.id === parseInt(req.params.id));
    if(index==-1)
    {
       return res.status(404).send("not found");
    }
    teas.splice(index,1);
    res.status(204).send('deleted')
})


app.listen(port, ()=>{
    console.log(`server is runnong on port: ${port}...`);
})