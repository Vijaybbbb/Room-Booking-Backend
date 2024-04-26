const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
       userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
       },
       username: {
              type: String,

       },
       firstname: {
              type: String,

       },
       lastname: {
              type: String,

       },
       state: {
              type: String,

       },
       location: {
              type: String,

       },
       email: {
              type: String,

       },
       phone: {
              type: String,

       },
       pincode: {
              type: String,

       },
       profileImg:{
              type:String
       }
   
}, { timestamps: true });

const UserDetails = mongoose.model('userDetails', userDetailsSchema);

module.exports = UserDetails;