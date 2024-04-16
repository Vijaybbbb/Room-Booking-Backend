const jwt  = require('jsonwebtoken');
const {createError}  = require('../utils/error.js')

const verifyTocken = async(req,res,next) =>{
       //take value from cookie
       const tocken = await req.cookies.access_tocken;
       const userId = req.query.userId
       if(!tocken){
             next(createError(401,'Invalid Creadentials'))
       }
       jwt.verify(tocken,process.env.JWT_SECRET_KEY,(err,user)=>{
              if(err){
                     return next(createError(401,'Invalid Tocken'))     
              }
              if(userId === user.id){
                     next()
              }else{
                     return next(createError(401,'Authentication failed'))
              }

             
       })

}



module.exports = { 
       verifyTocken                       
}