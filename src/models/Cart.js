const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    resource_name:{
        type:String,
        required: true,
    },
    owner_email:{
        type: String,
        required: true,
    },
    requester_name:{
        type: String,
        required: true,
    },
    requester_email:{
        type: String,
        required: true,
    },
    approval:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Cart = mongoose.model('Cart',userSchema);

module.exports = Cart;