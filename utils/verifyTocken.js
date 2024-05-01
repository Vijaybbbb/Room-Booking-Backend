const jwt  = require('jsonwebtoken');
const {createError}  = require('../utils/error.js')

const verifyTocken = async(req,res,next) =>{
       //take value from cookie
       try {
              const tocken = await req.cookies.access_tocken;
              const userId = req.query.userId
             // console.log(userId);

              if(!tocken || !userId){
                    return next(createError(401,'Invalid Creadentials'))
              }
              jwt.verify(tocken,process.env.JWT_SECRET_KEY,(err,user)=>{
                   
                     if(err){
                            console.log(err);
                            return next(createError(401,'Invalid Tocken'))       
                     }
                     if(userId == user.id){
                           // console.log("next");
                           next()
                     }else{
                          //  console.log("error");
                            return next(createError(401,'Authentication failed'))    
                     }
       
                    
              }) 
       } catch (error) {
              console.log(error);
       }

}



module.exports = { 
       verifyTocken                       
}