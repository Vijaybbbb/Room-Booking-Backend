const Otp  = require('../Model/otp') 
 
 
 
 const otpVerify = async(req,res,next) =>{
       const email = req.query.email;
       const {userOtp} = req.body 
      if(!userOtp){
            return res.json({message:"No otp Found"})
      }
      const generatedOtp = await Otp.find({email})
      console.log(generatedOtp);
      if(generatedOtp.length == 0 ){
            return res.json({message:'OTP not found or has expired'})
     }

     const now=new Date();
       //checks otp expired
      if(now > generatedOtp.expireAt){
            return res.json({message:'OTP  has expired'})
       }







      //  const hashedPassword = await bcrypt.hash(password, 10)
      //         const newUser = {
      //                userName: username,
      //                email: email,
      //                password: hashedPassword
      //         }
      //         await User.create(newUser)
      //         res.status(200).json({ message: 'User Hasbeen created' })
 }


 module.exports = {
      otpVerify
 }