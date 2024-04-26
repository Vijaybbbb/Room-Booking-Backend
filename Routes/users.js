const express = require('express')
const router = express.Router()
const { verifyTocken } = require('../utils/verifyTocken.js')
const { getSingleUser,
       updateUser,
       deleteUser,
       createOrder,
       verifyPayment,
       getAllBookings,
       cancelOrder,
       updateUserDetails,
       singleUserDetails,
       checkCoupenValid
} = require('../Controller/users.js')


const multer = require('multer')

const storage = multer.diskStorage({
       destination: function (req, file, cb) {
              cb(null, '../RoomBooking/src/images')
       },
       filename: function (req, file, cb) {
              const uniqueSuffix = Date.now()
              cb(null, uniqueSuffix + file.originalname)
       }
})

const upload = multer({ storage: storage })




router.post('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})

router.get('/singleUser',getSingleUser)

router.put('/updateUser',updateUser)

router.delete('/deleteUser',deleteUser)

router.post('/createOrder',createOrder) 

router.post('/verifyPayment',verifyPayment) 

router.get('/getAllBookings/:userId',getAllBookings) 

router.post('/cancelOrder',cancelOrder) 

router.post('/updateUserDetails/:id',upload.single('image'),updateUserDetails) 

router.get('/singleUserDetails/:id',singleUserDetails) 

router.post('/checkCoupenValid/:id',checkCoupenValid) 

module.exports  = router