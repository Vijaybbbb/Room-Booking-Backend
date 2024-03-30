const User = require('../Model/user.js')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')



const register = async(req,res,next) =>{

       try {
            const {userName,email,password} = req.body
            const hashedPassword =await bcrypt.hash(password , 10 )
            const newUser = {
              userName:userName,
              email:email,
              password:hashedPassword
            }
            await User.create(newUser)
            res.status(200).send('User Hasbeen created')

       } catch (error) {
              
       }
}
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
                     res.status(200).send('Password Do not Match')
              }
            }
            else{
              res.status(401).send('User Not Found')
              
            }
            

       } catch (error) {
              
       }
}

module.exports = {
       register,
       login
}