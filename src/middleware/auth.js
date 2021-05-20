const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req,res,next)=>{
    try{
        
        const token = req.headers.authorization.replace('Bearer ','')
        
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
        
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        
        if(!user){
            throw new Error('token not found')
        }
        
        req.token = token
        req.user = user
        next()

    }  catch(e){
        res.status(400).send({error: "Please authenticate"})
    }
}

module.exports = auth