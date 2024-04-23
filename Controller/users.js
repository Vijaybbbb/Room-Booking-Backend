const Bookings = require("../Model/myBookings")
const User = require("../Model/user")
const { createError } = require("../utils/error")
const mongoose  = require('mongoose')
const { razorpayInstance } = require("../utils/paymentController")
const {RAZORPAY_ID_KEY} = process.env

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

const  createOrder = async (req,res,next)=>{
       const {hotelId,hotelName,userId,rooms,price,dates} = req.body

       try {
              let newDates   = []
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

          dates.forEach(function(timestamp) {
              newDates.push(formatDate(timestamp))
          });


           

            try {          
              const bookingData = {
                     hotel:hotelId,
                     rooms:rooms,
                     checkInDate:newDates[0],
                     checkOutDate:newDates[newDates.length -1 ],
                     totalPrice:price,
              }

              // Create new Booking instance
             await Bookings.updateOne({userId:userId},{$addToSet:{
              bookings:{
                     hotel:hotelId,
                     rooms:rooms[0],
                     checkInDate:newDates[0],
                     checkOutDate:newDates[newDates.length -1 ],
                     totalPrice:price,
              }
             }})

            
             try {
              const amount  = price * 100
              const options ={
                     amount:amount,
                     currency:'INR',
                     receipt:'vijayramkp2002@gmail.com'
              }  
              razorpayInstance.orders.create(options,
                     (err,order)=>{
                            if(!err){
                                   res.status(200).json({
                                          success:true,
                                          msg:'order created',
                                          order_id:order.id,
                                          key_id:RAZORPAY_ID_KEY,
                                          name:hotelName,
                                          amount:amount
                                          
                                   })
                            }else{
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


const createOrder1 = (req,res,next)=>{
       const {hotelId,hotelName,userId,rooms,price,dates} = req.body
   
    
}

module.exports = {
       getSingleUser,
       updateUser,
       deleteUser,
       createOrder,
       
      
}