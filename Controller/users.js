const Bookings = require("../Model/myBookings")
const User = require("../Model/user")
const { createError } = require("../utils/error")
const mongoose = require('mongoose')
const { razorpayInstance } = require("../utils/paymentController")
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env
const crypto = require('crypto')
const Hotels = require("../Model/hotel")
const Room = require("../Model/room")
const UserDetails = require("../Model/userDetails")
const Coupen = require("../Model/coupen")
const easyinvoice = require('easyinvoice');


const getSingleUser = async (req, res, next) => {
       try {

              const user = await User.findById(req.query.id)
              if (!user) {
                     next(createError(401, 'User not found'))
              }
              return res.status(200).json(user)
       } catch (err) {
              next(createError(401, 'Failed to get User'))

       }

}

const updateUser = async (req, res, next) => {
       const { username, email } = req.body
       try {

              const user = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(req.query.id), {
                     $set: { username: username, email: email }
              })


              return res.status(200).json(user)
       } catch (err) {
              console.log(err);
              next(createError(401, 'Failed to get User'))

       }

}

const blockUser = async (req, res, next) => {

       try {

              if (req.body.blocked) {
                     const user = await User.findByIdAndUpdate(req.query.id, {
                            $set: {
                                   isBlocked: false
                            }
                     })
                     return res.status(200).json(user)

              }
              const user = await User.findByIdAndUpdate(req.query.id, {
                     $set: {
                            isBlocked: true
                     }
              })

              return res.status(200).json(user)

       } catch (err) {
              console.log(err);
              next(createError(401, 'Failed to get User'))

       }

}

const createOrder = async (req, res, next) => {
      
       let { checkoutDetails, priceAfterCoupen } = req.body
       if (priceAfterCoupen) {
              // Create a new object with the updated price
              checkoutDetails = { ...checkoutDetails, price: priceAfterCoupen };
       }
       const { hotelId, hotelName, userId, rooms, price, dates, roomNumbers, images } = checkoutDetails

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
                     if (user) {
                            const data = await Bookings.updateOne({ userId: userId }, {
                                   $addToSet: {
                                          bookings: {
                                                 hotel: hotelId,
                                                 hotelName: hotel.name,
                                                 rooms: rooms[0],
                                                 checkInDate: newDates[0],
                                                 checkOutDate: newDates[newDates.length - 1],
                                                 totalPrice: price,
                                                 bookedNumbers: roomNumbers[0],
                                                 images: images[0],
                                                 allDates: newDates
                                          }
                                   }
                            })
                           

                     } else {
                           
                            const data = new Bookings({
                                   userId: userId,
                                   bookings: [
                                          {
                                                 hotel: hotelId,
                                                 hotelName: hotel.name,
                                                 rooms: rooms[0],
                                                 checkInDate: newDates[0],
                                                 checkOutDate: newDates[newDates.length - 1],
                                                 totalPrice: price,
                                                 bookedNumbers: roomNumbers[0],
                                                 allDates: newDates


                                          }
                                   ]
                            })

                            await data.save()
                            
                     }
              
                     const data = await Bookings.findOne({ userId: userId })
                     const lastBookingId = data?.bookings[data.bookings.length - 1]?._id


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
                                                        bookingId: lastBookingId
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
const verifyPayment = async (req, res, next) => {
       const { response, bookingId, userId, coupenCode } = req.body

       const payment_id = response.razorpay_payment_id;
       const order_id = response.razorpay_order_id
       const signature = response.razorpay_signature;

       try {
              const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET_KEY);
              hmac.update(order_id + '|' + payment_id);

              // Calculating the HMAC digest (resulting hash)
              const digest = hmac.digest('hex');

              if (digest == signature) {
                     console.log("payment successs",);

                     PaymentStatus(bookingId, userId, coupenCode).then((data)=>{
                          
                     }).catch(err=>console.log(err))

                     res.status(200).json({ message: 'order placed', response: response })
              }

       } catch (error) {
              console.log(error);
              next(createError(401, 'Payment Failed'))
       }

}



//set payment status to each new bookings
async function PaymentStatus(bookingId, userId, coupenCode) {

       try {
              if (coupenCode) {
                     await User.findByIdAndUpdate(userId, {
                            $push: {
                                   claimedCoupens: coupenCode
                            }
                     })
              
               }
              const result = await Bookings.updateOne(
                     { userId: userId, "bookings._id": bookingId },
                     { $set: { "bookings.$.status": "Payment Success" } }
              );

              return result;

       } catch (error) {
              console.log(error);
       }
}



const getAllBookings = async (req, res, next) => {

       try {
              let array = []
              const data = await Bookings.findOne({ userId: req.params.userId })
              if (!data) {
                     next(createError(401, 'No Bookings yet'))
              }
             
              data.bookings.map((booking) => {
                     booking.status !== 'Processing' ? array.push(booking) : ''
              }
              )
            

              return res.status(200).json(array.reverse())

       } catch (error) {
              
              next(createError(401, 'Failed to get Bookings'))

       }
}


const cancelOrder = async (req, res, next) => {
       const { orderId, userId, rooms, hotelId, allDates } = req.body

       let timestampsToRemove = []
       const timestamps = allDates.map(dateString => {
              const timestamp = new Date(dateString).getTime();
              timestampsToRemove.push(timestamp)
       });

       try {
              //cancel rooom from booking
              const result = await Bookings.bulkWrite([
                     {
                            updateOne: {
                                   filter: {
                                          userId: new mongoose.Types.ObjectId(userId),
                                          "bookings._id": new mongoose.Types.ObjectId(orderId)
                                   },
                                   update: {
                                          $set: {
                                                 "bookings.$.status": "Canceled"
                                          }
                                   }
                            }
                     }
              ]);

              await Promise.all(rooms.map(async (room) => {
                     const result = await Room.updateOne(
                            { "roomNumbers._id": room }, // Match the room with the given roomId
                            { $pull: { "roomNumbers.$.unavailableDates": { $in: timestampsToRemove } } } // Pull timestampsToRemove from unavailableDates array
                     );
                     console.log(`Room ${room} updated`);
              }));




              return res.status(200).json('success')

       } catch (error) {
              console.log(error);
              next(createError(401, 'Failed to cancel order'))

       }
}

const updateUserDetails = async (req, res, next) => {
       console.log(req.file);
       const details = req.body

       const userId = new mongoose.Types.ObjectId(req.params.id)
       try {
              const data = await UserDetails.findOne({ userId: req.params.id })
              if (!data) {
                     await UserDetails.create({
                            userId: userId,
                            username: details.username,
                            firstname: details.firstname,
                            lastname: details.lastname,
                            state: details.state,
                            location: details.location,
                            email: details.email,
                            phone: details.phone,
                            pincode: details.pincode,
                            profileImg: req.file.filename
                     })
              }
              else {
                     await UserDetails.updateOne({ userId: req.params.id }, {
                            $set: {
                                   username: details.username,
                                   firstname: details.firstname,
                                   lastname: details.lastname,
                                   state: details.state,
                                   location: details.location,
                                   email: details.email,
                                   phone: details.phone,
                                   pincode: details.pincode,
                                   profileImg: req.file.filename
                            }
                     })
              }
              return res.status(200).json('success')

       } catch (error) {
              console.log(error);
              next(createError(401, 'Failed to update details'))

       }
}

const singleUserDetails = async (req, res, next) => {

       try {
              const data = await UserDetails.findOne({ userId: req.params.id })
              if (!data) {
                     next(createError(401, 'No Bookings yet'))
              }
              return res.status(200).json(data)

       } catch (error) {
              next(createError(401, 'Failed to get Bookings'))

       }
}

const checkCoupenValid = async (req, res, next) => {

       const { coupenCode, price } = req.body
       const user = await User.findOne({ _id: req.params.id })

       try {
              const coupenFind = await Coupen.findOne({ code: coupenCode })

              if (!coupenFind) {
                     next(createError(401, 'No Coupen Found'))
              }
              else {
                     const coupenUsed = user.claimedCoupens.some(code => code == coupenCode)

                     if (coupenUsed) {
                            next(createError(401, `Coupen Already Redeemed`))
                     }
                     else {
                            if (price < coupenFind.minOrder) {
                                   next(createError(401, `Applicable only for orders above ${coupenFind.minOrder}`))
                            }
                            if (coupenFind.discountType == 'percentage') {

                                   const finalPrice = price - (price * coupenFind.discountValue / 100);
                                   return res.status(200).json({ message: 'coupen Applied', finalPrice: finalPrice, code: coupenCode });
                            }
                            else {
                                   const finalPrice = price - coupenFind.discountValue;
                                   return res.status(200).json({ message: 'coupen Applied', finalPrice: finalPrice, code: coupenCode });

                            }
                     }
              }



       } catch (error) {
              console.log(error);
              next(createError(401, 'Failed to get Bookings'))

       }
}




const generateInvoiceHandler = async (req, res, next) => {
       try {
              console.log("entered the invoice handler");

              const orderId = req.body.orderId;
              const userId = req.params.id;
              const user = await User.findById(userId)

              if (!orderId) {
                     return res.status(400).json({ message: 'Missing orderId in the request body' });
              }
              const pipeline = [
                     // Match documents where the userId matches
                     { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                     // Unwind the bookings array
                     { $unwind: "$bookings" },
                     // Match documents where the orderId matches
                     { $match: { "bookings._id": new mongoose.Types.ObjectId(orderId) } },
                     // Project to reshape the document to its original structure 
                     {
                            $project: {
                                   _id: 0,
                                   userId: 1,
                                   bookings: 1
                            }
                     }
              ];

              const order = await Bookings.aggregate(pipeline)
              const dateObject1 = new Date(order[0].bookings.checkInDate);
              const dateObject2 = new Date(order[0].bookings.checkOutDate);
              const formattedDate1 = dateObject1.toISOString().split('T')[0]; 
              const formattedDate2 = dateObject2.toISOString().split('T')[0];      
              
              const data = {
                     sender: {
                            company: 'Get Your Room Pvt LTD',
                            address: 'Banglore,india',
                            zip: 'GFRFY5636',
                            city: 'Banglore',
                            country: 'india'
                     },
                     client: {
                            company: user.username, // Client's company name
                            city: 'Payment Success', // City might represent the status in this context
                            state: order[0].bookings.totalPrice, // State might represent the total price in this context
                     },
                     images: {}, // You can add images here if necessary
                     information: {
                            date: `${formattedDate1} to ${formattedDate2}`

                     }, // Additional information can be added here
                     products: [
                            {
                                   description: order[0].bookings.hotelName, // Description of the product or service
                                   quantity: order[0].bookings.rooms.length, // Assuming one booking
                                   price: order[0].bookings.totalPrice// Total price of the booking
                            }
                     ],
                     settings: {
                            currency: 'INR' // Currency for the invoice
                     }
              };




              // Create your invoice! Easy!
              easyinvoice.createInvoice(data, function (result) {
                     console.log("invoice created");
                     // The response will contain a base64 encoded PDF file
                     const pdfBase64 = result.pdf;

                     // Send the PDF as a response
                     res.setHeader('Content-Type', 'application/pdf');
                     res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
                     res.send(Buffer.from(pdfBase64, 'base64'));
              });

       } catch (error) {
              console.error(error);

       }
};

module.exports = {
       getSingleUser,
       updateUser,
       blockUser,
       createOrder,
       verifyPayment,
       getAllBookings,
       cancelOrder,
       updateUserDetails,
       singleUserDetails,
       checkCoupenValid,
       generateInvoiceHandler


}