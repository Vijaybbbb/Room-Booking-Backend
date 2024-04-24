const express = require('express')
const router = express.Router()

const {createHotel,
       updatedHotel,
       getAllHotels,
       countByCity,
       countByType,
       getAllFeaturedHotels,
       getHotelsByFilter,
       getSingleHotel,
       getHotelRooms
}  = require('../Controller/hotels.js')




const multer  = require('multer')

const storage = multer.diskStorage({
       destination:function(req,file,cb){
              cb(null,'uploads/')
       }, 
       filename:function (req,file,cb){
              const uniqueSuffix = Date.now()
              cb(null,uniqueSuffix+file.originalname)
       }
})

const upload = multer({storage:storage})




//create hotel
router.post('/',upload.single('image'),createHotel)

//update hotel
router.put('/find/:id',updatedHotel)

//get all hotels 
router.get('/',getAllHotels)

//get all featured hotels 
router.get('/featured',getAllFeaturedHotels)

//get hotel by filtering
router.get('/filter',getHotelsByFilter)

//get hotels by city
router.get('/countByCity',countByCity)

//get hotels by type
router.get('/countByType',countByType)

//get single hotel
router.get('/:id',getSingleHotel)

router.get('/room/:id',getHotelRooms)

module.exports  = router