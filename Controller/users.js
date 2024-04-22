const User = require("../Model/user")
const { createError } = require("../utils/error")


const getSingleUser = async (req,res,next)=>{
       try {          
              
              const user = await User.findById(req.query.id)
              if(!user){
                     next(createError(401,'User not found'))
              }
              return res.status(200).json(user)
              } catch (err) {
                     next(createError(401,'Failed to get User'))
                     
               }

}

const updateUser = async (req,res,next)=>{
       const {username,email} = req.body
       try {          
              
              const user = await User.findByIdAndUpdate(req.query.id,{
                     $set:{username:username,email:email}  
              })
              if(user){
                     next(createError(401,'User not found'))
              }
              
              return res.status(200).json(user)
              } catch (err) {
                     next(createError(401,'Failed to get User'))
                     
               }

}

const deleteUser = async (req,res,next)=>{

       try {          
              
              const user = await User.findByIdAndDelete(req.query.id)
              if(user){
                     next(createError(401,'User not found'))
              }
              
              return res.status(200).json(user)
              } catch (err) {
                     next(createError(401,'Failed to get User'))
                     
               }

}

const addToBookings = async (req,res,next)=>{

       try {          
              
              
              
           
              } catch (err) {
                     next(createError(401,'Failed to Book Room'))
                     
               }

}

module.exports = {
       getSingleUser,
       updateUser,
       deleteUser,
       addToBookings

}