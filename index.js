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
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const cors = require('cors')
const session = require('express-session')

//mongoDB connection function
 try {
       mongoose.connect(process.env.MONGO)
       console.log("DataBase connected");
} catch (error) {
       console.log('Connection Failed');
 }


//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }))
//Routes middlewares
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.use('/hotels',hotelsRouter)
app.use('/rooms',roomsRouter)

app.use(session({
       secret: 'your-secret-key',
       resave: false,
       saveUninitialized: true,
     }));

app.use((err,req,res,next)=>{
       const errorStatus  = err.status || 500
       const errorMessage  = err.Message || 'Something Went Wrong'

       return res.status(errorStatus).json({
              success:false,
              status:errorMessage,
              message:errorMessage,
              stack:err.stack
       })
})

app.get('/',(req,res)=>{
       res.send('welcome');
}).listen(3000)
