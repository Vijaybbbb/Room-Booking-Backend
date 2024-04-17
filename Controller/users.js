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

module.exports = {
       getSingleUser
}