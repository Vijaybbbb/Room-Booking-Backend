const mongoose  = require('mongoose')


const hotelSchema = new mongoose.Schema({
       name:{
              type:String,
            required:true
       },
       type:{
              type:String,
              required:true
       },
       city:{
              type:String,
             required:true
       },
       address:{
              type:String,
             required:true
       },
       distance:{
              type:String,
              required:true
       },
       photos:{
              type:[String],
       
       },
       description:{
              type:String,
              required:true
       },
       rating:{
              type:Number,
              min:0,
              max:5,
              default:4.0
       },
       rooms:{
              type:[String],
              ref:'rooms'
       },
       cheapestPrice:{
              type:Number,
              required:true  
       },
       featured:{
              type:Boolean,
              default:false
       },
       images:[
              {
                     type:String  
              }
       ]    
       
},
{timestamps:true}
)

const Hotels  = mongoose.model('hotel',hotelSchema)

module.exports = Hotels