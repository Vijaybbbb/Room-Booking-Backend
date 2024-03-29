const Hotels = require('../Model/hotel.js')

//create hotel function
const createHotel = async(req,res,next) =>{
       const newHotel  = req.body
       try {
            await Hotels.create(newHotel)  
            res.status(200)
       } catch (error) {
              next(error)
       }
}

const updatedHotel = async(req,res,next) =>{
       const updatedHotel = await  Hotels.findByIdAndUpdate(req.params.id,{$set : req.body})
       try {
            await Hotels.create(newHotel)  
            res.status(200)
       } catch (error) {
              next(error)
       }
}



module.exports ={
       createHotel,
       updatedHotel
}