const express = require('express')
const router = new express.Router()


router.get('/login',(req,res)=>{
    res.send("Hello World")
})

module.exports = router