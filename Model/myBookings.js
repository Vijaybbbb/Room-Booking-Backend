
const mongoose  = require('mongoose')


const bookingsSchema =new mongoose.Schema({
       userId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:'user',
              required:true
       },
       bookings:[
             {
                hotel: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: 'hotel',
                     required: true
                 },
                 room: {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: 'room',
                     required: true
                 },
                 checkInDate: {
                     type: Date,
                     required: true
                 },
                 checkOutDate: {
                     type: Date,
                     required: true
                 },
                 totalPrice: {
                     type: Number,
                     required: true
                 }
             }
       ]
},{timestamps:true})

const Bookings  = mongoose.model('bookings',bookingsSchema)

module.exports = Bookings