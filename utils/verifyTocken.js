const jwt  = require('jsonwebtoken');
const {createError}  = require('../utils/error.js')

const verifyTocken = async(req,res,next) =>{
       const tocken  = req.cookie.access_tocken
       if(!tocken){
              return next(createError(401,'Invalid Creadentials'))

       }
       jwt.verify(tocken,process.env.JWT_SECRET_KEY,(err,user)=>{
              if(err){
                     return next(createError(401,'Invalid Tocken')) 
              }
              req.user = user;
              next();
})

}

module.exports = {
       verifyTocken
}