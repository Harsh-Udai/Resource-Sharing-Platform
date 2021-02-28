const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// Router for creating user at Backend
router.post('/users/create',async (req,res)=>{
    const user = new User(req.body)   // Data recieve from the request
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
        
    } catch(e){
        
        res.status(400).send(e)
    }
})

module.exports = router