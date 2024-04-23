
const mongoose  = require('mongoose')


const bookingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        default: 'Processing'
    },
    bookings: [
        {
            hotel: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'hotel',
                required: true
            },
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
            }
        }
    ]
}, { timestamps: true })

const Bookings  = mongoose.model('bookings',bookingsSchema)

module.exports = Bookings