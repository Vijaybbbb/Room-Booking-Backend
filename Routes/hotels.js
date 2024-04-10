const express = require('express')
const router = express.Router()

const {createHotel,
       updatedHotel,
       getAllHotels,
       countByCity,
       countByType,
       getAllFeaturedHotels,
       getHotelsByFilter
}  = require('../Controller/hotels.js')


//create hotel
router.post('/',createHotel)

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


module.exports  = router