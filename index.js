const express  = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const authRouter  = require('./Routes/auth.js')
const userRouter  = require('./Routes/users.js')
const adminRouter  = require('./Routes/admin.js')
const hotelsRouter  = require('./Routes/hotels.js')
const roomsRouter  = require('./Routes/rooms.js')


//mongoDB connection function
 try {
       mongoose.connect(process.env.MONGO)
       console.log("DataBase connected");
} catch (error) {
       console.log('Connection Failed');
 }


//middlewares 
app.use(express.json())


//Routes middlewares
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.use('/hotels',hotelsRouter)
app.use('/rooms',roomsRouter)



app.get('/',(req,res)=>{
       res.send('welcome');
}).listen(3000)
