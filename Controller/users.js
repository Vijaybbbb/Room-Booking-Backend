const Bookings = require("../Model/myBookings")
const User = require("../Model/user")
const { createError } = require("../utils/error")
const mongoose  = require('mongoose')
const { razorpayInstance } = require("../utils/paymentController")
const {RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY} = process.env
const crypto = require('crypto')
const Hotels = require("../Model/hotel")
const Room = require("../Model/room")

const getSingleUser = async (req,res,next)=>{
       try {          
              
              const user = await User.findById(req.query.id)
              if(!user){
                     next(createError(401,'User not found'))
              }
              return res.status(200).json(user)
              } catch (err) {
                     next(createError(401,'Failed to get User'))
                     
               }

}

const updateUser = async (req,res,next)=>{
       const {username,email} = req.body
       try {          
              
              const user = await User.findByIdAndUpdate(req.query.id,{
                     $set:{username:username,email:email}  
              })
              if(user){
                     next(createError(401,'User not found'))
              }
              
              return res.status(200).json(user)
              } catch (err) {
                     next(createError(401,'Failed to get User'))
                     
               }

}

const deleteUser = async (req,res,next)=>{

       try {          
              
              const user = await User.findByIdAndDelete(req.query.id)
              if(user){
                     next(createError(401,'User not found'))
              }
              
              return res.status(200).json(user)
              } catch (err) {
                     next(createError(401,'Failed to get User'))
                     
               }

}

const createOrder = async (req, res, next) => {

       const { hotelId, hotelName, userId, rooms, price, dates , roomNumbers,images } = req.body
       console.log(roomNumbers);
       const hotel = await Hotels.findById(hotelId);

       try {
              let newDates = []
              function formatDate(timestamp) {
                     // Convert timestamp to milliseconds
                     var date = new Date(timestamp);

                     // Options for formatting the date
                     var options = {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit'
                     };

                     // Format the date using toLocaleDateString method
                     return date.toLocaleDateString('en-US', options);
              }

              dates.forEach(function (timestamp) {
                     newDates.push(formatDate(timestamp))
              });




              try {
                     // Create new Booking instance
                     const user = await Bookings.findOne({ userId: userId })
                     if(user){
                            await Bookings.updateOne({ userId: userId }, {
                                   $addToSet: {
                                          bookings: {
                                                 hotel: hotelId,
                                                 hotelName:hotel.name,
                                                 rooms: rooms[0],
                                                 checkInDate: newDates[0],
                                                 checkOutDate: newDates[newDates.length - 1],
                                                 totalPrice: price,
                                                 bookedNumbers:roomNumbers[0],
                                                 images:images[0]
                                          }
                                   }
                            })
       
                     }else{
                            await Bookings.create({
                                   userId:userId,
                                   bookings:[
                                          {
                                                 hotel:hotelId,
                                                 hotelName:hotel.name,
                                                 rooms:rooms[0],
                                                 checkInDate: newDates[0],
                                                 checkOutDate: newDates[newDates.length - 1],
                                                 totalPrice: price,
                                                 bookedNumbers:roomNumbers[0]

                                          }
                                   ]
                            })
                     }
                    
                     const data = await Bookings.findOne({ userId: userId })
                     const lastBookingId = data.bookings[data.bookings.length-1]._id
                        

                     try {
                            const amount = price * 100
                            const options = {
                                   amount: amount,
                                   currency: 'INR',
                                   receipt: 'vijayramkp2002@gmail.com'
                            }
                            razorpayInstance.orders.create(options,
                                   (err, order) => {
                                          if (!err) {

                                                 res.status(200).json({
                                                        success: true,
                                                        msg: 'order created',
                                                        order_id: order.id,
                                                        key_id: RAZORPAY_ID_KEY,
                                                        name: hotelName,
                                                        amount: amount,
                                                        order: order,
                                                        bookingId:lastBookingId
                                                 })
                                          } else {
                                                 console.log(err);
                                          }
                                   }
                            )





                     } catch (error) {

                     }

              } catch (error) {
                     console.log(error);

              }
       } catch (error) {
              console.log(error);
       }

}

//verify payment
const verifyPayment = (req, res, next) => {
       const { response, bookingId ,userId} = req.body
       
       const payment_id = response.razorpay_payment_id;
       const order_id = response.razorpay_order_id
       const signature = response.razorpay_signature;

       try {
              const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET_KEY);
              hmac.update(order_id +'|'+ payment_id);

              // Calculating the HMAC digest (resulting hash)
              const digest = hmac.digest('hex');

              if(digest == signature){
                     console.log("payment successs");
                     PaymentStatus(bookingId,userId) 
                     res.status(200).json({message:'order placed'})
              }

       } catch (error) {
              
              next(createError(401,'Payment Failed'))
       }

}



//set payment status to each new bookings
async function PaymentStatus(bookingId,userId){
       try {
              const result = await Bookings.updateOne(
                  
                  { userId: userId, "bookings._id": new mongoose.Types.ObjectId(bookingId) },
                  
                  { $set: { "bookings.$.status": "Payment Success" } }
              );
          } catch (error) {
              console.log(error);
          }
}



const  getAllBookings  = async (req,res,next) =>{

              try {
                     const data = await Bookings.findOne({userId:req.params.userId})
                     if(!data){
                            next(createError(401,'No Bookings yet'))
                     }
                     return res.status(200).json(data)

              } catch (error) {
                            next(createError(401,'Failed to get Bookings'))
 
              }
}



// async function findDetails(hotelId, rooms) {
//        try {
//          const hotel = await Hotels.findById(hotelId);
//          let roomsDetails = [];
             
//          // Use Promise.all() to handle multiple asynchronous operations
//          await Promise.all(
//            rooms[0].map(async (room) => {
//              const data = await Room.findOne({_id:room});
//               console.log(data);
//        //       roomsDetails.push({roomName:data.title,
//        //                             roomPrice:data.price,
//        //                             maxPeople:data.maxPeople
//        //                      })
//            })
//          );
     
//          // Return the details once all asynchronous operations are completed
//          return {hotel,roomsDetails};
//        } catch (error) {
//          console.error('Error finding details:', error);
//          throw error; // Propagate the error if necessary
//        }
//      }
     


module.exports = {
       getSingleUser,
       updateUser,
       deleteUser,
       createOrder,
       verifyPayment,
       getAllBookings
       
      
}