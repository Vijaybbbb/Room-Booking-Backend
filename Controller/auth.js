const User = require('../Model/user.js')
const Otp = require('../Model/otp.js')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const {generateOtp,
       sendOtpToEmail,
}  = require('../utils/userOtp.js')



const register =  async (req, res, next) => {
       try {
           const { username, email, password } = req.body;

           const findExistingUser = await User.findOne({ email });
           if (findExistingUser) {
               return res.status(422).json({ message: 'User Already Exists' });
           }
           
           // delete existing otp
           await Otp.deleteMany({ email });
           // generate random otp
           const otp = generateOtp().toString();
           // hash otp
           const hashedOtp = await bcrypt.hash(otp, 5);
           // send otp
           await sendOtpToEmail(email, otp);
     
           const expireAt = Date.now() + 60 * 1000; // expire within 60 seconds
           await Otp.create({
               email: email,
               otp: hashedOtp,
               createdAt: Date.now(),
               expireAt,
           });
   
           const hashedPassword = await bcrypt.hash(password,10)   
       //     const newUser = {
       //            userName: username,
       //            email: email,
       //            password: hashedPassword
       //     }
       //     await User.create(newUser)
    
           res.status(200).json({ message: 'User registered successfully' });

           return password

       } catch (error) {
           if (error.name == 'MongoServerError') {
               res.status(422).json({ message: 'Internal Server Error' });
           } else {
               console.error(error);
               res.status(500).json({ message: 'Internal Server Error' });
           }
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

                     const {password,isAdmin,...otherDetails} = user
                     res.cookie('access_tocken',tocken,{httpOnly:true}).status(200).json({...otherDetails});
              }
              else{
                     res.status(200).json('Password Do not Match')
              }
            }
            else{
              res.status(401).json('User Not Found')
              
            }
            

       } catch (error) {
              
       }
}



 
 const otpVerify = async(req,res,next) =>{

       const pass=register()

       console.log("wwwwwwwwwwww",pass);

       const {email,userOtp} = req.body;
      if(!userOtp){
            return res.json({message:"No otp Found"})
      }
      const generatedOtp = await Otp.find({email})
      if(generatedOtp.length == 0 ){
            await Otp.deleteMany({ email });
            return res.json({message:'OTP not found or has expired'})       
     }

     const now=new Date();
       //checks otp expired
      if(now > generatedOtp[0].expireAt){
   

            return res.json({message:'OTP  has expired'})
       }
      const isOtpValid =  bcrypt.compare(userOtp,generatedOtp[0].otp)
      console.log(isOtpValid);
      if(isOtpValid){
             return await Otp.updateOne({ email },{$set:{otpVerified:true}});  
      }
      
 }





module.exports = {
       register,
       login,
       otpVerify
}