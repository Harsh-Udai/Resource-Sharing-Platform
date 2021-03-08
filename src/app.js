const express = require('express')
const cors = require('cors')

require('./db/mongoose')

const loginRoute = require('./routes/login')

const app =express()
app.use(cors())
app.use(express.json())
app.use(loginRoute);






module.exports = app