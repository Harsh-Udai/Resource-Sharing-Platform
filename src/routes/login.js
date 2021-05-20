const express = require('express')

const otpGen = require('otp-generator')
const bcrypt = require('bcryptjs')

const{sendWelcomeEmail,cancelEmail,securityM} = require('../emails/account')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()


router.post('/Signup/email',async(req,res)=>{
    try{
        const checkUp = await User.find({email: req.body.email});
        if(checkUp.length===0){
            const otp = otpGen.generate(6,{upperCase:false,alphabets:false});
            sendWelcomeEmail(req.body.email,'');
            securityM(req.body.email,otp);
            res.send({otp: otp});
        }
        else{
            res.send("Already");
        }
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/Reset/email',async(req,res)=>{
    try{
        const checkUp = await User.find({email: req.body.email});
        if(checkUp.length===0){
            res.send("NO");
        }
        else{
            const otp = otpGen.generate(6,{upperCase:false,alphabets:false});
            //sendWelcomeEmail(req.body.email,'');
            securityM(req.body.email,otp);
            res.send({otp: otp});
        }
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/Reset/Update',async(req, res)=>{
    try{
        
        const checkUp = await User.find({email: req.body.email});
        checkUp[0].password =  (req.body.newPass)
        await checkUp[0].save();
        res.send('Done')
    }
    catch(e){
        res.send("error")
    }   
})

router.post('/users/create',async (req,res)=>{
    const user = new User(req.body)   
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200).send({"token": token});
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/confirm',auth,async(req,res)=>{
    try{
        res.send('all set')
    }
    catch(e){
        res.send(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user  = await User.findByCredentials(email,password)
        res.status(200).send(user)
    }
    catch(e){
        res.send({user:'noUser'})
    }
})

module.exports = router