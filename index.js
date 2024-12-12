const express = require('express')
const connectDB = require('./connextDB/DBconnect')
const router = require('./Routes/v1')


const app = express()


app.listen(5050,
    ()=>{
    console.log('server is running on port 5050')
})

app.use(express.json())
app.use('/v1', router)

connectDB()