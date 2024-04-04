const mongoose = require('mongoose')



const connect =async () =>{
       //mongoDB connection function
 try {
       await mongoose.connect(process.env.MONGO)
       console.log("DataBase connected");
} catch (error) {
       console.log('Connection Failed');
 }
}

module.exports = {
       connect
}