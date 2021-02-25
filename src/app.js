const express = require('express')

require('./db/mongoose')

const loginRoute = require('./routes/login')

const app =express()
app.use(express.json())
app.use(loginRoute);






module.exports = app