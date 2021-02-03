const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const dotenv = require('dotenv')

// main app
const app = express()
dotenv.config()

const db = require('./database')
db.connect((err) => {
    if (err) return console.error('error connecting')

    console.log(`connected with id : ${db.threadId}`)
})
// apply middleware
app.use(cors())
app.use(bodyparser.json())


// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)

const {userRouter, moviesRouter} = require('./router')
app.use('/user', userRouter)
app.use('/movies', moviesRouter)
// app.use('/movie', adminRouter)

// bind to local machine
const PORT = process.env.PORT || 2000
app.listen(PORT, () => `CONNECTED : port ${PORT}`)