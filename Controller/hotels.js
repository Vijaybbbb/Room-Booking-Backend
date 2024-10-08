const Hotels = require('../Model/hotel.js')
const Room = require('../Model/room.js')

const { createError } = require('../utils/error.js')





//create hotel function
const createHotel = async(req,res,next) =>{

       const images = req.files.map(file => file.filename);
       const data  = {
              name:req.body.name,
              type:req.body.type,
              city:req.body.city,
              address:req.body.address,
              distance:req.body.distance,
              description:req.body.description,
              cheapestPrice:req.body.cheapestPrice, 
              images:images
       }

    try {



            await Hotels.create(data)  
            res.status(200).json({message:"success"})
       } catch (error) {
              console.log(error);
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
            res.status(200).json({message:'Hotel has been updated'})
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
// const getAllHotels = async (req,res,next) =>{
//        const  {min,max,city}  = req.query
//        try {
//               const hotels = await Hotels.find({
//                      city: { $regex: new RegExp(city, "i") },
//                      cheapestPrice:{$gt:min || 1,$lt:max || 20000}})
//              // const hotels = await Hotels.find()
//               res.json(hotels)
//        } catch (error) {
//               next(createError(200,'Failed to get all hotels'))
//        }
// }


const getAllHotels = async (req,res,next) =>{
       const  {min,max,city,type}  = req.query
        
       try {
            if(type == ''){
              const hotels = await Hotels.find({
                     city: { $regex: new RegExp(city, "i") },
                     cheapestPrice:{$gt:min || 1,$lt:max || 20000}})
                     res.json(hotels)
            }
            else{
              const hotels = await Hotels.find({
                     city: { $regex: new RegExp(city, "i") },
                     type:type,
                     cheapestPrice:{$gt:min || 1,$lt:max || 20000}})
                     res.json(hotels)
            }
           
             
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
       console.log( req.params.id);
       const id  = req.params.id
       try {
              const hotel  = await Hotels.findById(id)
              return res.status(200).json(hotel)
       } catch (error) {
              next(createError(401,'Hotel not found'))
       }
}

//get single hotel by id
const getSingleHotelAllRooms = async (req, res, next) => {
       const roomDetails = [];
       const hotelId = req.params.id;
   
       try {
           const hotel = await Hotels.findById(hotelId);
           
           if (!hotel) {
               return next(createError(404, 'Hotel not found'));
           }
   
           if (hotel.rooms.length !== 0) {
               const roomPromises = hotel.rooms.map(roomId => Room.findById(roomId));
               const rooms = await Promise.all(roomPromises);
               return res.status(200).json(rooms);
           }
   
           return res.status(200).json({ message: 'No rooms available' });
   
       } catch (error) {
           next(createError(500, 'Internal server error'));
       }
   };
   

//get hotel by city
const countByCity = async (req,res,next) =>{
      // console.log('count');
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
              const hotelCount  = await Hotels.countDocuments({type:'Hotel'})
              const apartmentsCount  =await Hotels.countDocuments({type:'Apartment'})
              const resortCount  =await Hotels.countDocuments({type:'Resort'})
              const villaCount  =await Hotels.countDocuments({type:'Villa'})
              const cabinCount  =await Hotels.countDocuments({type:'Cabin'})
              res.status(200).json([
                     {type:"Hotel",count:hotelCount},
                     {type:"Apartment",count:apartmentsCount},
                     {type:"Resort",count:resortCount},
                     {type:"Villa",count:villaCount},
                     {type:"Cabin",count:cabinCount},

              ])
              
       } catch (error) {
              console.log(error);
       }
}

//get room from unique hotel  ids
const getHotelRooms  = async (req,res,next) =>{
       try {
              const hotel = await Hotels.findById(req.params.id)
              const list  = await Promise.all(hotel.rooms.map(room=>{
                      return Room.findById(room)
              }))
              return res.status(200).json(list)

       } catch (error) {
              next(createError(401,'failed to get room'))
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
       getSingleHotel,
       getHotelRooms,
       getSingleHotelAllRooms
}