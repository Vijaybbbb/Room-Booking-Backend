const User = require('../Model/user.js')
const Otp = require('../Model/otp.js')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const {generateOtp,
       sendOtpToEmail,
}  = require('../utils/userOtp.js')
const { createError } = require('../utils/error.js')

//user registration
const register =  async (req, res, next) => {
       try {
           const { username, email, password } = req.body;
           const findExistingUser = await User.findOne({ email });
           if (findExistingUser) {
               return next(createError(401,'User Already Exists'))
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
              next(createError(401,"User registration failed"))
       }
   };
   
//user login
const login = async(req,res,next) =>{

       try {
            const {email,password} = req.body
            const user = await User.findOne({email:email})
            if(!user){
                     return next(createError(401,'User Not Found'))
            }
            if(user.isBlocked == true){
              return next(createError(401,'User Blocked'))
            }
            else{
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
                     return next(createError(401,'Invalid Credentials'))
              }
            }
       } catch (error) {
                      return next(createError(401,'Login Failed'))
             
       }
}

 //take otp from user and verify
 const otpVerify = async(req,res,next) =>{
       try {
              const { email, userOtp } = req.body;
            const user = await User.findOne({email:email})

              if (!userOtp) {
                     return next(createError(401,'No OTP Found'))
              }
              const generatedOtp = await Otp.find({ email })
              if (generatedOtp.length == 0) {
                     return next(createError(401,'OTP not found or has expired'))
              }
      
              const now = new Date();
              //checks otp expired
              if (now > generatedOtp[0].expireAt) {
                     return next(createError(401,'OTP has expired'))
              }
              const isOtpValid = await bcrypt.compare(userOtp, generatedOtp[0].otp)
              if (isOtpValid) {
                     await User.updateOne({ email }, { $set: { otpVerified: true } });
                     const tocken  = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY)
                     const {password,isAdmin,...otherDetails} = user._doc
                     res.cookie('access_tocken',tocken,{
                            httpOnly:true,
                            path:'/'
                            }
                            ).status(200).json({ message: 'Login success',...otherDetails});
                    
              }else{
                     return next(createError(401,'Incorrect OTP'))
              }
       } catch (error) {
              next(createError(401,'OTP Authentication Failed'))
       }
 }

 //resend the otp
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


//reset the password
const passwordReset = async(req,res,next) =>{
      try {
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

       return res.status(200).json({message:"Otp send Suuccesfully"})

      } catch (error) {
              console.log(error);
      }       
}

//create new password
const newPasswordSet = async(req,res,next) =>{
       try {
              const { newPassword,confirmnNewPassword,email} = req.body
              const user = await User.findOne({email:email})
              if (newPassword !== confirmnNewPassword) {
                     return res.status(400).json({ message: 'Passwords do not match' });
              }
              const hashedPassword = await bcrypt.hash(newPassword,10)
              await User.updateOne({email},{$set:{password:hashedPassword}})
              const tocken  = jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY)
                     const {password,isAdmin,...otherDetails} = user._doc
                     res.cookie('access_tocken',tocken,{
                            httpOnly:true,
                            path:'/'
                            }
                            ).status(200).json({...otherDetails});
       
       } catch (error) {
              console.log(error);
              return res.status(400).json({message:'error'})
       }
     
       
}





module.exports = {
       register,
       login,
       otpVerify,
       otpResend,
       passwordReset,
       newPasswordSet
       
}