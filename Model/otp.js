const mongoose  = require('mongoose')

const otpSchema = new mongoose.Schema({
       email:String,
       otp:String,
       createdAt:Date,
       expireAt:Date

})

const Otp = mongoose.model('Otp',otpSchema)

module.exports = Otp