const User = require("../Model/user");
const Hotels = require("../Model/hotel");

const { createError } = require("../utils/error");
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')

const adminLogin = async (req,res,next) =>{
       try {
              const {email,password} = req.body
              const user = await User.findOne({email:email})
              if(!user){
                       return next(createError(401,'Email Not Found'))
              }
              else{
                     if (user.isAdmin === true) {

                            const checkPassword = await bcrypt.compare(password, user.password)
                            if (checkPassword) {
                                   const tocken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY)
                                   const { password, isAdmin, ...otherDetails } = user._doc
                                   res.cookie('access_tocken', tocken, {
                                          httpOnly: true,
                                          path: '/'
                                   }
                                   ).status(200).json({ ...otherDetails });
                            }
                            else {
                                   return next(createError(401, 'Invalid Credentials'))
                            }
                     }
                     else{
                            return next(createError(401, 'Login Failed')) 

                     }
              }
         } catch (error) {
                        return next(createError(401,'Login Failed'))
               
         }
}

const adminHome  = async (req,res,next)=>{
       return res.status(200).json({message:'success'})
}

const getAllUsers  = async (req,res,next)=>{
       
       try {
              const users = await User.find({isAdmin:false})
              return res.status(200).json(users)

       } catch (error) {
              next(createError(401,'Failed to get all users'))  
       }
}


const getAllHotels  = async (req,res,next)=>{
       
       try {
              const hotels = await Hotels.find()
              return res.status(200).json(hotels)

       } catch (error) {
              next(createError(401,'Failed to get all users'))  
       }
}



module.exports = {
       adminLogin,
       adminHome,
       getAllUsers,
       getAllHotels
       
}