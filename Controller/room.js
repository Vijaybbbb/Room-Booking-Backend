const Room  =  require('../Model/room')
const Hotels  =  require('../Model/hotel')
const {createError}   =  require('../utils/error.js');
const Bookings = require('../Model/myBookings.js');

//create new room
const  createRoom  = async (req,res,next) =>{

       const hotelId = req.params.id;
       const updatedObject = {
              ...req.body, 
              roomNumbers: {
                     number:Number(req.body.roomNumbers),
                     unavailableDates:[]
              }
            };
    


       const newRoom  = new Room(updatedObject)
     
       try{
              const savedRoom = await newRoom.save()
              try {
                     await Hotels.findByIdAndUpdate(hotelId ,
                            {$push : {rooms:savedRoom._id}})
              } catch (error) {
                      return next(createError(401,'Failed'))    
              }
              res.status(200).json(savedRoom)
       }
       catch(error){
              return next(createError(401,'Failed'))
       }
}
//update rooom
const updateRoom = async (req, res, next) => {

       try {

              try {

                     await Room.findByIdAndUpdate(req.params.id,
                            { $set: req.body },
                            { new: true }
                     )
                     res.status(200).json("Updated")

              } catch (error) {
                     console.log(error);
                     // return next(createError(401,'Failed'))    
              }

       }
       catch (error) {
              console.log(error);

              return next(createError(401, 'Failed'))
       }
}

//delete room
const deleteRoom  = async (req,res,next) =>{

       const hotelId = req.params.hotelId;
       try{
             await Room.findByIdAndDelete(req.params.id)
              try {
                     await Hotels.findByIdAndUpdate(hotelId,{
                            $pull:{rooms:req.params.id}
                     })
                     return res.status(200).json(' Room has been deleted ');
              } catch (error) {
                     return next(createError(401,'Failed'))    
              }
       }
       catch(error){
              return next(createError(401,'Failed'))
       }
}

//checking room availability
const updateRoomAvailability  = async(req,res,next) =>{
       try {
              const dateToAdd  = req.body.dates;
             
              const dates = dateToAdd?.map(timestamp => {
                     const date = new Date(timestamp);
                     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                 });
                 
              await Room.updateOne({'roomNumbers._id':req.params.id},{
                     $push:{
                            'roomNumbers.$.unavailableDates':{$each : dateToAdd}
                     }
              })
              
           
       } catch (error) {
              console.log(error);
       }
} 

//get a single rooom
const getSingleRoom  = async(req,res,next) =>{
       try {
        const room = await Room.findById(req.params.id) 
        if(!room){
              next(createError(401,'Room not found'))
        } 
        res.status(200).json(room)
       } catch (error) {
              next(createError(401,'something went wrong'))
              
       }
} 

//get a single rooom
const getAllRoom  = async(req,res,next) =>{
       try {
        const rooms = await Room.find() 
        if(!rooms){
              next(createError(401,'No Room found'))
        } 
        res.status(200).json(rooms)
       } catch (error) {
              next(createError(401,'something went wrong'))
              
       }
} 


module.exports = {
       createRoom,
       updateRoom,
       deleteRoom,
       updateRoomAvailability,
       getSingleRoom,
       getAllRoom
}