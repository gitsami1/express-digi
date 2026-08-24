import express from 'express'
import 'dotenv/config'
import logger from "./logger.js";
import morgan from "morgan";

const app= express();
const port= process.env.PORT || 3000
app.use(express.json());
app.get("/", (req,res)=>{
    res.send("hello world")
})
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

let teas=[]
let nextId=1;
app.post("/tea",(req,res)=>{
    logger.info(`Received request to add a new tea`);
    logger.warn(`This is a warning message for adding a new tea`);
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