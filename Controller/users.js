const Otp  = require('../Model/otp') 
const bcrypt = require('bcrypt')
 
 const otpVerify = async(req,res,next) =>{
       const {email,userOtp} = req.body;
      if(!userOtp){
            return res.json({message:"No otp Found"})
      }
      const generatedOtp = await Otp.find({email})
      console.log(generatedOtp);
      if(generatedOtp.length == 0 ){
            await Otp.deleteMany({ email });
            return res.json({message:'OTP not found or has expired'})
            
     }

     const now=new Date();
       //checks otp expired
      if(now > generatedOtp[0].expireAt){
            return res.json({message:'OTP  has expired'})
       }
      const username  = req.session.username
      const password  = req.session.password
       console.log(password);
      const isOtpValid =  bcrypt.compare(userOtp,generatedOtp[0].otp)
       if(isOtpValid){
             const hashedPassword = await bcrypt.hash(password,10)
              const newUser = {
                     userName: username,
                     email: email,
                     password: hashedPassword
              }
              await User.create(newUser)
              res.status(200).json({ message: 'User Hasbeen created' })
       }





      
 }


 module.exports = {
      otpVerify
 }