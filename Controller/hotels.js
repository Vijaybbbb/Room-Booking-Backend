const Hotels = require('../Model/hotel.js')
const { createError } = require('../utils/error.js')

//create hotel function
const createHotel = async(req,res,next) =>{
       const newHotel  = req.body
       try {
            await Hotels.create(newHotel)  
            res.status(200).json({message:"success"})
       } catch (error) {
              next(createError(401,'Creation Failed'))
       }

}

//update hotel function
const updatedHotel = async(req,res,next) =>{    
       try {
              const updatedHotel = await  Hotels.findByIdAndUpdate(req.params.id,
                     {$set : req.body},
                     {new:true}
              )
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

//get all  hotels list
const getAllHotels = async (req,res,next) =>{
       const  {min,max}  = req.query 
       try {
              const hotels = await Hotels.find({cheapestPrice:{$gt:min || 1,$lt:max || 999}})
              res.json(hotels)
       } catch (error) {
              next(createError(200,'Failed to get all hotels'))
       }
}

//get all  featured hotels
const getAllFeaturedHotels = async (req,res,next) =>{
       try {
              const hotels = await Hotels.find({featured:true}).limit(4)
              res.json(hotels)
       } catch (error) {
              next(createError(200,'Failed to get all hotels'))
       }
}

//get hotels by filter metthods
const getHotelsByFilter  = async() =>{
       const  {location,min,max,date}  = req.query
       const query = {

       } 
       try {
              const hotels = await Hotels.find(query)
              res.json(hotels)
       } catch (error) {
              next(createError(200,'Failed to get all hotels'))
       }
}

//get single hotel by id
const getSingleHotel = async(req,res,next) =>{
       const id  = req.params.id
       try {
              const hotel  = await Hotels.findById(id)
              return res.status(200).json(hotel)
       } catch (error) {
              next(createError(401,'Hotel not found'))
       }
}


//get hotel by city
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

//get hotels by type
const countByType = async (req,res,next) =>{

       try {
              const hotelCount  = await Hotels.countDocuments({type:'hotel'})
              const apartmentsCount  =await Hotels.countDocuments({type:'apartment'})
              const resortCount  =await Hotels.countDocuments({type:'resort'})
              const villaCount  =await Hotels.countDocuments({type:'villa'})
              const cabinCount  =await Hotels.countDocuments({type:'cabin'})
              res.status(200).json([
                     {type:"hotel",count:hotelCount},
                     {type:"apartment",count:apartmentsCount},
                     {type:"resort",count:resortCount},
                     {type:"villa",count:villaCount},
                     {type:"cabin",count:cabinCount},

              ])
              
       } catch (error) {
              console.log(error);
       }
}


module.exports ={
       createHotel,
       updatedHotel,
       deleteHotel,
       getAllHotels,
       countByCity,
       countByType,
       getAllFeaturedHotels,
       getHotelsByFilter,
       getSingleHotel
}