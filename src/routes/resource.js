const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const Resource = require('../models/resource')
const sharp = require('sharp')
const User = require('../models/user')

router.get('/resource',(req,res)=>{
    res.send("Hello World!")
})

const upload = multer({
    
    fileFilter(req,file,cb){
        if( !file.originalname.match(/\.(jpg||jpeg||png)$/) ){
            return cb(new Error('Upload a file with jpg,jpeg,png format'))
        }
        cb(undefined,true)
    }
})

router.post('/uploadResource',upload.single('image'),async(req,res)=>{
    // console.log(req.body);
    // console.log(req.file);

    req.body.resource_Name = req.body.resource_Name.toLowerCase();
    // req.body.owner = req.body.owner.toLowerCase();
    req.body.classification = req.body.classification.toLowerCase();

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

router.post('/FindResource',async(req,res)=>{
    try{
        // console.log(req.body)
        const data = await Resource.find({resource_Name:req.body.find})
        const data1 = await Resource.find({owner:req.body.find})
        const data2 = await Resource.find({classification:req.body.find})

        const data3 = data1.concat(data2)

        //console.log(data.length,data1.length);

        if(data.length!=0 || data1.length!=0 || data2.length!=0){
            res.send(data.concat(data3));
        }
        else{
            res.send("NO")
        }

        
    }
    catch(e){
        res.status(404).send({error:"issues"});
    }
})

router.post('/Profile',auth,async(req,res)=>{
    try{
        const user = await User.find({init_token:req.body.token})
        const data1 = await Resource.find({owner:user[0].name})
        const data2 = [];
        data1.map((en)=>{
            data2.push(en.classification)
        })

        // console.log(user)
        // console.log(data1)
        // console.log(data2)
        // console.log(data1.length);
        // console.log(data1)
        res.send({
            name:user[0].name,
            email:user[0].email,
            count:data1.length,
            class:[...new Set(data2)]  //...new Set(data2)
        })
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/Profile/userData',auth,async(req,res)=>{
    try{

        const user = await User.find({init_token:req.body.token})
        const data1 = await Resource.find({owner:user[0].name})
        
        
        res.send(data1)
        
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/Profile/userData/delete',auth,async(req,res)=>{
    try{
        
        const data1 = await Resource.deleteOne({token_Check:req.body.token,resource_Name:req.body.name})
        const user = await User.find({init_token:req.body.token})
        const data2 = await Resource.find({owner:user[0].name})
        res.send(data2)
    }
    catch(e){
        res.status(400).send(e);
    }
})

// router.post('/Profile/ResourceCount',auth,async(req,res)=>{
//     try{
//         const user = await User.find({init_token:req.body.token})
//         const data1 = await Resource.find({owner:user[0].name})
        
//         res.send({
            
//             count:data1.length,
            
//         })
//     }
//     catch(e){
//         res.status(400).send(e);
//     }
// })

module.exports = router