
const mongoose  = require('mongoose')


const bookingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    bookings: [
        {
            hotel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'hotel',
                required: true
            },
            hotelName: {
                type:String ,
            },
            images:[
                {
                       type:String  
                }
            ],
            rooms: [
                {
                    type: String,
                    required: true
                }
            ],
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
            },
            status: {
                type: String,
                default: 'Processing'
            },
            bookedNumbers: {
                type: [Number], // Define the type as an array of numbers
                default: [] // Default value is an empty array
            }
        }
    ]
}, { timestamps: true })

const Bookings  = mongoose.model('bookings',bookingsSchema)

module.exports = Bookings