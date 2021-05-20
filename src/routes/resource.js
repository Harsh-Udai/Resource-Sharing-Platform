const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const Resource = require('../models/resource')
const sharp = require('sharp')
const User = require('../models/user')


const upload = multer({
    
    fileFilter(req,file,cb){
        if( !file.originalname.match(/\.(jpg||jpeg||png)$/) ){
            return cb(new Error('Upload a file with jpg,jpeg,png format'))
        }
        cb(undefined,true)
    }
})

router.post('/uploadResource',upload.single('image'),async(req,res)=>{
    req.body.resource_Name = req.body.resource_Name.toLowerCase();
    req.body.classification = req.body.classification;
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    const buffer1 = await sharp(req.file.buffer).toBuffer()
    req.body.image = buffer;
    req.body.imageF = buffer1;
    const resource = new Resource(req.body);
    await resource.save()
    res.send()
    
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.get('/retriveResource',async(req,res)=>{
    try{
        const images = await Resource.find({})
        res.send(images)
    }
    catch(e){
        res.status(404).send({error:"issues"});
    }

})

router.post('/FindResource',async(req,res)=>{
    try{
        const data = await Resource.find({resource_Name:req.body.find})
        const data1 = await Resource.find({owner:req.body.find})
        const data2 = await Resource.find({classification:req.body.find})
        const data3 = data1.concat(data2)
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
        res.send({
            name:user[0].name,
            email:user[0].email,
            count:data1.length,
            class:[...new Set(data2)]  
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

router.post('/Resource/interest',auth,async(req,res)=>{
    try{
        const resource = await Resource.find({resource_Name:req.body.name});
        const changeRes = resource[0].queue.filter((dt)=>{
            return dt.email!==req.body.email && dt.name!==req.body.user
        })
        if(changeRes.length !== resource[0].queue.length){
            resource[0].queue = changeRes;
            resource[0].likes-=1;
            await resource[0].save();  
            res.send("0");
        }
        else{
            resource[0].queue = resource[0].queue.concat([{
                name:req.body.user,
                email:req.body.user_email,
                date:req.body.date +" "+ req.body.time
            }])
            resource[0].likes+=1;
            await resource[0].save();  
            res.send("1");
        }
    }
    catch(e){
        res.status(404).send(e);
    }
})

router.post('/ResourceFind',auth,async(req,res)=>{
    try{
        const resource = await Resource.find({resource_Name:req.body.name,email:req.body.email});
        res.send(resource[0]);
    }
    catch(e){
        res.status(404).send(e)
    }
})

router.post('/ResourceFindUpdate',auth,async(req,res)=>{
    try{
        const resource = await Resource.find({resource_Name:req.body.Name,email:req.body.Email})
        const data = {
            name: resource[0].resource_Name,
            desc : resource[0].resource_Description,
            classification : resource[0].classification,
            image:resource[0].image,
            queue:resource[0].queue,
            borrow:resource[0].borrow,
            price:resource[0].Price
        }
        res.send(data);
    }
    catch(e){
        res.status(404).send(e)
    }
})

router.post('/ResourceFindUpdateRefresh',upload.single('image'),async(req,res)=>{
    try{
        const resource = await Resource.find({resource_Name:req.body.OriginalName,email:req.body.email});
        resource[0].resource_Name= req.body.resource_Name
        resource[0].resource_Description = req.body.resource_Description
        resource[0].classification = req.body.classification
        resource[0].borrow = req.body.borrow
        resource[0].Price = req.body.Price
        if(req.body.image!==''){
            const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
            const buffer1 = await sharp(req.file.buffer).toBuffer()
            resource[0].image = buffer;
            resource[0].imageF = buffer1;
        }
        if(req.body.QDel==='true'){
            resource[0].queue = []
        }
        resource[0].save();
        res.send("Done!!");
    }
    catch(e){
        res.status(404).send(e)
    }
})

module.exports = router