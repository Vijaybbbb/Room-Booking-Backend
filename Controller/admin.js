const User = require("../Model/user");
const Hotels = require("../Model/hotel");
const Coupen = require("../Model/coupen");
const Bookings = require("../Model/myBookings");


const { createError } = require("../utils/error");
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");

const adminLogin = async (req,res,next) =>{
       try {
              const {email,password} = req.body
              const user = await User.findOne({email:email})
              if(!user){
                       return next(createError(401,'Email Not Found'))
              }
              else{
                     if (user.isAdmin === true) {

                            const checkPassword = await bcrypt.compare(password, user.password)
                            if (checkPassword) {
                                   const tocken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY)
                                   const { password, isAdmin, ...otherDetails } = user._doc
                                   res.cookie('access_tocken', tocken, {
                                          httpOnly: true,
                                          path: '/'
                                   }
                                   ).status(200).json({ ...otherDetails });
                            }
                            else {
                                   return next(createError(401, 'Invalid Credentials'))
                            }
                     }
                     else{
                            return next(createError(401, 'Login Failed')) 

                     }
              }
         } catch (error) {
                        return next(createError(401,'Login Failed'))
               
         }
}

const adminHome  = async (req,res,next)=>{
       return res.status(200).json({message:'success'})
}

const getAllUsers  = async (req,res,next)=>{
       
       try {
              const users = await User.find({isAdmin:false})
              return res.status(200).json(users.reverse())

       } catch (error) {
              next(createError(401,'Failed to get all users'))  
       }
}


const getAllHotels  = async (req,res,next)=>{
       
       try {
              const hotels = await Hotels.find()
              return res.status(200).json(hotels)

       } catch (error) {
              next(createError(401,'Failed to get all users'))  
       }
}


const createNewUser  = async (req,res,next)=>{
     
       try {
           const { username, email, password } = req.body;
           const findExistingUser = await User.findOne({ email });
           if (findExistingUser) {
               return next(createError(401,'User Already Exists'))
           }
           const hashedPassword = await bcrypt.hash(password,10)   
           const newUser = {
             username: username, 
             email: email,
             password: hashedPassword,   
         };
         await User.create(newUser)
           res.status(200).json({ message: 'User registered successfully' });

       } catch (error) {
              next(createError(401,'Failed to create users'))  
       }
}



const createNewCoupen  = async (req,res,next)=>{
     
       try {
           await Coupen.create(req.body)
           res.status(200).json({ message: 'Coupen created successfully' });

       } catch (error) {
              console.log(error);
              next(createError(401,'Failed to create Coupen'))  
       }
}

const getAllBookings  = async (req,res,next)=>{
     
       try {
         const result =  await Bookings.find()
          let list = [] 
         result.map((userObj)=>{
              userObj.bookings.map((bookings)=>{
                     list.push({user:userObj.userId,
                               bookingId:bookings._id,
                               status:bookings.status,
                               price:bookings.totalPrice,
                               bookedNumbers:bookings.bookedNumbers,
                               allDates:bookings.allDates,
                               hotelName:bookings.hotelName,
                               hotel:bookings.hotel
                            })   
              })
         })

         res.status(200).json(list);

       } catch (error) {
              console.log(error);
              next(createError(401,'Failed to create Coupen'))  
       }
}

const getAllCoupens  = async (req,res,next)=>{
     
       try {
         const result =  await Coupen.find()
     
         res.status(200).json(result);

       } catch (error) {
              console.log(error);
              next(createError(401,'Failed to create Coupen'))  
       }
}

const getSingleCoupen  = async (req,res,next)=>{
     
       try {
         const result =  await Coupen.findById(req.params.id)
     
         res.status(200).json(result);

       } catch (error) {
              console.log(error);
              next(createError(401,'Failed to create Coupen'))  
       }
}

const updateCoupen  = async (req,res,next)=>{
     const coupenData = req.body
     console.log(coupenData);
       try {
              const id  = new mongoose.Types.ObjectId(req.params.id)
              const result =  await Coupen.findByIdAndUpdate(id,{
              $set:{
                    code: coupenData.code,
                    discountType: coupenData.discountType,
                    discountValue: coupenData.discountValue,
                    minOrder: coupenData.minOrder,   
              }
         })
     
         res.status(200).json(result);

       } catch (error) {
              console.log(error);
              next(createError(401,'Failed to create Coupen'))  
       }
}


module.exports = {
       adminLogin,
       adminHome,
       getAllUsers,
       getAllHotels,
       createNewUser,
       createNewCoupen,
       getAllBookings,
       getAllCoupens,
       getSingleCoupen,
       updateCoupen
}