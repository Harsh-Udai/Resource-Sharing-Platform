const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const Resource = require('../models/resource')
const sharp = require('sharp')

router.get('/resource',(req,res)=>{
    res.send("Hello World!")
})

const upload = multer({
    limit:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if( !file.originalname.match(/\.(jpg||jpeg||png)$/) ){
            return cb(new Error('Upload a file with jpg,jpeg,png format'))
        }
        cb(undefined,true)
    }
})

router.post('/uploadResource',upload.single('image'),async(req,res)=>{
    console.log(req.body);
    console.log(req.file);

    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.body.image = buffer;
    const resource = new Resource(req.body);

    await resource.save()
    res.send()
    
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.get('/retriveResource',async(req,res)=>{

    try{
        const images = await Resource.find({})
        //console.log(images);
        res.send(images)
    }
    catch(e){
        res.status(404).send({error:"issues"});
    }

})

module.exports = router