const User = require('../Model/user.js')
const Otp = require('../Model/otp.js')
const hotels =require('../Model/hotel.js')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const {generateOtp,
       sendOtpToEmail,
}  = require('../utils/userOtp.js')
const Hotels = require('../Model/hotel.js')



const register =  async (req, res, next) => {
       try {
           const { username, email, password } = req.body;
              req.session.password = password
           const findExistingUser = await User.findOne({ email });
           if (findExistingUser) {
               return res.status(422).json({ message: 'User Already Exists' });
           }

          const hashedPassword = await bcrypt.hash(password,10)   
          const newUser = {
            username: username, 
            email: email,
            password: hashedPassword,   
        };
              // delete existing otp
              await Otp.deleteMany({email});
              // generate random otp
              const otp = generateOtp().toString();
              // hash otp           
              const hashedOtp = await bcrypt.hash(otp, 5);
              // send otp
              await sendOtpToEmail(email, otp);
        
              const expireAt = Date.now() + 120 * 1000; // expire within 60 seconds
              await Otp.create({
                  email: email,
                  otp: hashedOtp,
                  createdAt: Date.now(),
                  expireAt,
              });
           await User.create(newUser)
           res.status(200).json({ message: 'User registered successfully' });

       } catch (error) {
              console.log(error);
               res.status(500).json({ message: 'Internal Server Error' });
       }
   };
   

const login = async(req,res,next) =>{

       try {
            const {email,password} = req.body
            const user = await User.findOne({email:email})
            if(user){
              const checkPassword = await bcrypt.compare(password,user.password)
              if(checkPassword){
                     const tocken  = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY)
                     const {password,isAdmin,...otherDetails} = user._doc
                     res.cookie('access_tocken',tocken,{
                            httpOnly:true,
                            path:'/'
                            }
                            ).status(200).json({...otherDetails});

              }
              else{
                     res.status(400).json('Password Do not Match')
              }
            }
            else{
                      res.status(401).json('User Not Found')
            }

       } catch (error) {
              console.log(error);
       }
}



 
 const otpVerify = async(req,res,next) =>{

       const {email,userOtp} = req.body;

      if(!userOtp){
            return res.json({message:"No otp Found"})
      }
      const generatedOtp = await Otp.find({email})
      if(generatedOtp.length == 0 ){
            return res.json({message:'OTP not found or has expired'})       
     }

     const now=new Date();
       //checks otp expired
      if(now > generatedOtp[0].expireAt){
            return res.json({message:'OTP  has expired'})
       }
      const isOtpValid = await bcrypt.compare(userOtp,generatedOtp[0].otp)
      if(isOtpValid){
              await User.updateOne({ email },{$set:{otpVerified:true}});
              return res.status(200).json({message:'Login success'})
      }
      
 }

 

const otpResend = async(req,res,next) =>{
       const {email} = req.body
       // delete existing otp
       await Otp.deleteMany({email});
       // generate random otp
       const otp = generateOtp().toString();
       // hash otp
       const hashedOtp = await bcrypt.hash(otp, 5);
       // send otp
       await sendOtpToEmail(email, otp);
 
       const expireAt = Date.now() + 120 * 1000; // expire within 60 seconds
       await Otp.create({
           email: email,
           otp: hashedOtp,
           createdAt: Date.now(),
           expireAt,
       });
       res.status(200).json({ message: 'Otp Resend successfully' });
}


const hotelData=async(req,res)=>{
       try{
const datas=await Hotels.find()
return res.status(200).json(datas)
       }catch(err){

       }
}


module.exports = {
       register,
       login,
       otpVerify,
       otpResend,
       hotelData
}