const express = require('express')
const cors = require('cors')
const http = require('http');
require('./db/mongoose')

const loginRoute = require('./routes/login')
const resourceRoute = require('./routes/resource')
const cartRoute = require('./routes/cart')
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

const app =express()
app.use(cors())
app.use(express.json())
app.use(loginRoute);
app.use(resourceRoute);
app.use(cartRoute)
app.use("/api/conversations",conversationRoute);
app.use("/api/messages",messageRoute);

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

let users = [];



io.on('connect', async(socket) => {
    console.log('a user connected');
    const data1 = await DataRetrive();
    io.emit("DataE",data1);
    socket.on('client',async(data)=>{
        DataSave(data);
        const data2 = await DataRetrive();
        io.emit("DataE",data2);
    })


    
    // socket.on('addUser',userId=>{
    //     addUser(userId,socket.id);
    //     console.log(users);
    //     io.emit('getUsers', users);
    // })

    // //send and get message

    // socket.on("sendMessage",({senderId,receiverId,text})=>{
    //     const user = getUser(receiverId);
    //     if(user){
    //         io.to(user.socketId).emit('getMessage',{
    //             senderId,
    //             text,
    //         })
    //     }
        
    // })


    // // when disconnect

    // socket.on('disconnect',()=>{
    //     console.log('a user got disconnected');
    //     removeUser(socket.id);
    //     console.log(users);
    //     io.emit('getUsers', users);
    // })


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