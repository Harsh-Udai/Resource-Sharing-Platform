const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const{sendWelcomeEmail,cancelEmail,securityM} = require('../emails/account')
const { request } = require('express')
const auth = require('../middleware/auth')

// Router for creating user at Backend
router.post('/users/create',async (req,res)=>{
    const user = new User(req.body)   // Data recieve from the request
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        securityM(user.email,token);        
        res.status(200).send({"token": token});
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/confirm',auth,async(req,res)=>{
    try{
        console.log("succesfull entered");
        res.send('all set')
    }
    catch(e){
        res.send(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password)
    try{
        const user  = await User.findByCredentials(email,password)
        console.log(user)
        res.status(200).send(user)
    }
    catch(e){
        res.send({user:'No User Found!!'})
    }
    

})

module.exports = router