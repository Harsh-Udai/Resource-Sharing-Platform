const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    resource_Name:{
        type: String,
        required: true,
        trim: true
    },
    resource_Description:{
        type: String,
        required: true,
    },
    owner:{
        type: String,
        required: true
    },
    classification:{
        type: String,
        required: true
    },
    token_Check:{
        type:String,
        required: true
    },
    image:{
        type: Buffer
    },
    imageF:{
        type: Buffer
    },
    email:{
        type:String,
    },
    likes:{
        type: Number,
        default:0
    },
    borrow:{
        type:Boolean,
    },
    Price:{
        type:String,
        default:''
    },
    queue:[{
        name:{
            type:String,
            default:''
        },
        email:{
            type:String,
        },
        date:{
            type: String,
            default:''
        }
    }]
},{
    timestamps:true
})


const Resource = mongoose.model('Resource',userSchema)

module.exports = Resource