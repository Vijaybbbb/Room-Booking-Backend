const express  = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const authRouter  = require('./Routes/auth.js')
const userRouter  = require('./Routes/users.js')
const adminRouter  = require('./Routes/admin.js')
const hotelsRouter  = require('./Routes/hotels.js')
const roomsRouter  = require('./Routes/rooms.js')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const cors = require('cors')
const session = require('express-session')
const {connect}  = require('./utils/DatabaseConnect.js')
const { verifyTocken } = require('./utils/verifyTocken.js')
connect();

app.use(session({
       secret: 'your-secret-key', // Change this to a random secret key
       resave: false,
       saveUninitialized: false
   }));
   

//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true 
        }))

//Routes middlewares
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.use('/hotels',hotelsRouter)
app.use('/rooms',roomsRouter)


//error handling middleware
app.use((err,req,res,next)=>{
       const errorStatus  = err.status || 500
       const errorMessage  = err.message || 'Something Went Wrong'

       return res.status(errorStatus).json({
              success:false,
              status:errorStatus,
              message:errorMessage,
              stack:err.stack
       })
})


app.post('/clearCookie', (req, res) => {
       // Set the cookie's expiration date to a past time
       try {
              res.cookie('access_tocken', '', { expires: new Date(0) });
              // Send a response
              res.status(200).json('Cookie cleared'); 
       } catch (error) {
              console.log(error);
       }
   });



app.get('/',verifyTocken,(req,res)=>{
      res.status(200).json({message:'success'})
}).listen(3000)
