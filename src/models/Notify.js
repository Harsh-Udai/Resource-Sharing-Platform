const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name:{
        type:String,
        required: true,
    },
    Message:{
        type: String,
    },
    Date:{
        type: String,
        
    }
},{
    timestamps:true
})

const Notify = mongoose.model('Notify',userSchema);

module.exports = Notify;