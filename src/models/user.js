const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true, // all emails must be uniqe
        required: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    init_token:{
        type: String,
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})


userSchema.methods.generateAuthToken = async function(){
    const user  = this
    //console.log(user)
    
    const token = jwt.sign({_id: user._id.toString()},'resourceManagementApp')
    //console.log(token);
    
    user.init_token = token
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{

    const user  = await User.findOne({email: email})

    if(!user){
        throw new Error('Unable to login /No User')
    }

    
    const isMatch = await bcrypt.compare(password,user.password);


    if(!isMatch){
        throw new Error ('Unable to login /password issues')
    }

    return user

}

// Hash the plain Text Password
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})





const User = mongoose.model('User',userSchema)

module.exports = User;