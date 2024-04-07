const Hotels = require('../Model/hotel.js')
const { createError } = require('../utils/error.js')

//create hotel function
const createHotel = async(req,res,next) =>{
       const newHotel  = req.body
       try {
            await Hotels.create(newHotel)  
            res.status(200)
       } catch (error) {
              next(createError(401,'Creation Failed'))
       }
}

//update hotel function
const updatedHotel = async(req,res,next) =>{
       const updatedHotel = await  Hotels.findByIdAndUpdate(req.params.id,
              {$set : req.body},
              {new:true}
       )
       try {
            await Hotels.create(newHotel)  
            res.status(200)
       } catch (error) {
              next(createError(401,'Update Failed'))
       }
}


//deleteHotel function
const deleteHotel = async (req,res,next) =>{
       try {
              await Hotels.findByIdAndDelete(req.params.id);
              res.status(200).json({message:'Hotel has been deleted'})
       } catch (error) {
              console.log(error);
              next(createError(401,'Deletion Failed'))
       }
}

const getAllHotels = async (req,res,next) =>{
       try {
              const hotels = await Hotels.find({})
              res.json(hotels)
       } catch (error) {
              next(createError(200,'Failed to get all hotels'))
       }
}

const countByCity = async (req,res,next) =>{
       const cities = req.query.cities.split(',')
       try {
              const list  = await Promise.all(cities.map(city =>{
                     return Hotels.countDocuments({city:city})
              }))
              res.json(list)
       } catch (error) {
              next(createError(200,'Failed to get all hotels'))
       }
}







module.exports ={
       createHotel,
       updatedHotel,
       deleteHotel,
       getAllHotels,
       countByCity
}