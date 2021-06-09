const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const Resource = require('../models/resource')
const sharp = require('sharp')
const User = require('../models/user')
const { v4: uuidv4 } = require('uuid');

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
    req.body.unique_id = uuidv4();
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    const buffer1 = await sharp(req.file.buffer).toBuffer()
    req.body.image = buffer;
    req.body.imageF = buffer1;
    req.body.sold = 'NOPE';
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
        
        const data1 = await Resource.find({email:req.body.email})
        res.send(data1)
    }
    catch(e){
        res.send({msg:'no'});
    }
})

router.post('/Profile/userData/delete',auth,async(req,res)=>{
    try{
        
        const data1 = await Resource.deleteOne({unique_id:req.body.unique_id})

        let user = await User.find({});

        let user1 = user.map((dat)=>{
            // console.log(dat)
            // console.log(dat.cart)
            const newCart = dat.cart.filter((et)=>et.unique_key!==req.body.unique_id)
            dat.cart = newCart;
           
            dat.save();
        })
        
        
        
        const data2 = await Resource.find({email:req.body.email})
        
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
        
        
        const resource = await Resource.find({unique_id:req.body.unique_id});
    
        res.send(resource[0]);
        
        
        
    }
    catch(e){
        res.send({msg:'No'})
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
            price:resource[0].Price,
            unique_id:resource[0].unique_id
        }
        res.send(data);
    }
    catch(e){
        res.status(404).send(e)
    }
})

router.post('/ResourceFindUpdateRefresh',upload.single('image'),async(req,res)=>{
    try{
        const resource = await Resource.find({unique_id:req.body.unique_id,email:req.body.email});
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