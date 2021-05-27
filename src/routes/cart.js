const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Resource = require('../models/resource')
const User = require('../models/user')
const Cart = require('../models/Cart');
const{sendWelcomeEmail,cancelEmail,securityM,approveEmail} = require('../emails/account')
const { v4: uuidv4 } = require('uuid');

router.post('/cart/add',auth,async(req,res)=>{
    try{
        const user = await User.find({email:req.body.self_user});
        const user2 = user[0].cart.filter((data)=>{
            return data.unique_key!==req.body.unique_key
        })
        if(user2.length !== user[0].cart.length){
            res.send({msg:'Already'});
        }
        else{
            req.body.deal = false;
            user[0].cart = user[0].cart.concat(req.body);
            user[0].save();
            res.send({msg:'Added'})
        }        
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/cart/data',auth,async(req,res)=>{
    try{
        const data = await User.find({email:req.body.email})
        
        res.send(data[0].cart);
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/cart/remove',auth,async(req,res)=>{
    try{
        const data = await User.find({email:req.body.email})

        const data1 = (data[0].cart).filter((data)=>{
            return data.unique_key!=req.body.uuq
        })
        data[0].cart = data1;
        data[0].save();
        
        res.send({msg:'done'})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/cart/update',auth,async(req,res)=>{
    try{
        const user = await User.find({email:req.body.email});
        const newData = []
        user[0].cart.map((data)=>{
            if(data.unique_key===req.body.unique_id){
                data.deal=true;
            }
            newData.push(data);
        })

        user[0].cart = newData;
        await user[0].save();
        res.send('Done')
        
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/cart/pending',auth,async(req,res)=>{
    try{
        const user = await User.find({email:req.body.email});
        const user2 = user[0].pending.filter((data)=>{
            return data.unique_key!==req.body.unique_key
        })
        if(user2.length !== user[0].pending.length){
            res.send({msg:'Already'});
        }
        else{
            user[0].pending=user[0].pending.concat(req.body);
            await user[0].save();
            res.send({msg:'Done'});
        }
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/cart/approve',auth,async(req,res)=>{
    try{
        const user = await User.find({email:req.body.emailTo});
        const user2 = user[0].approveTo.filter((data)=>{
            return data.unique_key!==req.body.unique_key
        })
        if(user2.length !== user[0].approveTo.length){
            res.send({msg:'Already'});
        }
        else{
            user[0].approveTo=user[0].approveTo.concat(req.body);
            await user[0].save();
            res.send({msg:'Done'});
        }
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/request/data',auth,async(req,res)=>{
    try{
        const user = await User.find({email:req.body.email});
        res.send({pending:user[0].pending,approve:user[0].approveTo})
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/request/AppCancel',auth,async(req,res)=>{
    try{
        
        const user= await User.find({email:req.body.email});
        const newd= user[0].approveTo.filter((data)=>{
            return data.unique_key!=req.body.unique_id
        })
        
        user[0].approveTo = newd;
        

        const user1 = await User.find({email:req.body.email2});
        
        const dd=[]
        user1[0].pending.map((data)=>{
            if(data.unique_key===req.body.unique_id){
                data.finalApprove = 'Rejected';
                data.unique_key = uuidv4();
            }
            dd.push(data);
        })

        
        const data1 = (user1[0].cart).filter((data)=>{
            return data.unique_key!=req.body.unique_id
        })

        user1[0].cart = data1;
        

        user1[0].pending = dd;
        await user1[0].save();
        await user[0].save();

        


        res.send({msg:'done'});

    }   
    catch(e){
        res.status(400).send(e);
    }
})

router.post('/request/AppApprove',auth,async(req,res)=>{
    try{
        const user2 = await User.find({email:req.body.email2});
        
        const newD=[]
        user2[0].pending.map((data)=>{
            if(data.unique_key===req.body.unique_id){
                data.finalApprove='Accepted';
                data.deal=true;
                data.unique_key = uuidv4();
            }
            newD.push(data);
        })
        user2[0].pending=newD;

        const data1 = (user2[0].cart).filter((data)=>{
            return data.unique_key!=req.body.unique_id
        })

        user2[0].cart = data1;

        const user = await User.find({email: req.body.email});
        const newd=[]
        user[0].approveTo.map((data)=>{
            if(data.unique_key===req.body.unique_id){
                data.deal=true;
                data.unique_key = uuidv4();
            }
            newd.push(data);
        })
        user[0].approveTo=newd;

        await user[0].save();
        await user2[0].save();

        const rsq = await Resource.find({email: req.body.email,unique_id:req.body.unique_id});
        rsq[0].sold = 'SOLD';
        rsq[0].save();

        await approveEmail(req.body.email2,req.body.email2,req.body.resource_name)

        res.send({msg:'done'});

    }   
    catch(e){
        res.status(400).send(e);
    }
})

module.exports = router;