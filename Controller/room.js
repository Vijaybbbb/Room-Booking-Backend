const Room  =  require('../Model/room')
const Hotels  =  require('../Model/hotel')
const {createError}  = require('../utils/error.js')

//create new room
const  createRoom  = async (req,res,next) =>{

       const hotelId = req.params.id;
       const newRoom  = new Room(req.body)
       try{
              const savedRoom = await newRoom.save()
              console.log(savedRoom);
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
const updateRoom  = async (req,res,next) =>{

       const hotelId = req.params.hotelId;
       const newRoom  = new Room(req.body)
       try{
              const savedRoom = await newRoom.save()
              try {
                     await Hotels.findByIdAndUpdate(hotelId ,
                            {$push : {rooms:savedRoom._id}},
                            {new:true}
                     )
              } catch (error) {
                      return next(createError(401,'Failed'))    
              }
              res.status(200).json(savedRoom)
       }
       catch(error){
              return next(createError(401,'Failed'))
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
              } catch (error) {
                     return next(createError(401,'Failed'))    
              }
              res.status(200).json(savedRoom)
              res.status(200).json(' Room has been deleted ');
       }
       catch(error){
              return next(createError(401,'Failed'))
       }
}

//checking room availability
const updateRoomAvailability  = async(req,res,next) =>{
       try {
              const dateToAdd  = req.body.dates;
              await Room.updateOne({'roomNumbers._id':req.params.id},{
                     $push:{
                            'roomNumbers.$.unavailableDates':{$each : dateToAdd}
                     }
              })
              console.log('added');
       } catch (error) {
              
       }
} 




module.exports = {
       createRoom,
       updateRoom,
       deleteRoom,
       updateRoomAvailability
}