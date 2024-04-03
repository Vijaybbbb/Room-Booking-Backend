const jwt  = require('jsonwebtoken');
const {createError}  = require('../utils/error.js')

const verifyTocken = async(req,res,next) =>{
       //take value from cookie
       const tocken = req.cookies.access_tocken;
       console.log(tocken);
       if(!tocken){
              return next(createError(401,'Invalid Creadentials'))
       }
       jwt.verify(tocken,process.env.JWT_SECRET_KEY,(err,user)=>{
              if(err){
                     return next(createError(401,'Invalid Tocken'))     
              }
              next();
})

}

module.exports = { 
       verifyTocken                       
}