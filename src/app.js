const express = require('express')
const cors = require('cors')
const http = require('http');
require('./db/mongoose')

const loginRoute = require('./routes/login')
const resourceRoute = require('./routes/resource')

const app =express()
app.use(cors())
app.use(express.json())
app.use(loginRoute);
app.use(resourceRoute);

const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});

const Notify = require('./models/Notify');

io.on('connect', async(socket) => {
    console.log('a user connected');
    const data1 = await DataRetrive();
    io.emit("DataE",data1);
    socket.on('client',async(data)=>{
        DataSave(data);
        const data2 = await DataRetrive();
        io.emit("DataE",data2);
    })
});


let DataSave = async(data)=>{
    try{
        const user = new Notify(data);
        await user.save();
    }
    catch(e){
        console.log("Bhai Error hai dekh fir se!")
    }
}

let DataRetrive = async()=>{
    try{
        const data = await Notify.find({});
        return (data);
    }
    catch(e){
        console.log("Bhai Error hai dekh fir se!")
    }
}

app.get('/MSG',async(req,res)=>{
    try{
        const data = await Notify.find({});
        res.send(data);
    }
    catch(e){
        console.log("Bhai Error hai dekh fir se!")
    }
    
})


module.exports = server