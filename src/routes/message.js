const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Message = require("../models/Message");

router.get('/users',async(req,res)=>{
    try{
        const user = await User.find({});
        res.send(user);
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/findUser/:friendId',async(req,res)=>{
    try{
        const user = await User.findById(req.params.friendId);
        res.send(user);
    }
    catch(e){
        res.status(500).send(e)
    }
})

//add
router.post('/',async(req,res)=>{
    const newMessage = new Message(req.body);
    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }
    catch(e){
        res.status(500).json(e);
    }
})

//get 
router.get('/:conversationId',async(req,res)=>{
    try{
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    }
    catch(e){
        res.status(500).json(e);
    }
})


module.exports = router

