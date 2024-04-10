const express = require('express')
const router = express.Router()

const {createHotel,
       updatedHotel,
       getAllHotels,
       countByCity,
       countByType,
       getAllFeaturedHotels
}  = require('../Controller/hotels.js')


//create hotel
router.post('/',createHotel)

//update hotel
router.put('/find/:id',updatedHotel)

//get all hotels 
router.get('/',getAllHotels)

//get all featured hotels 
router.get('/featured',getAllFeaturedHotels)

router.get('/countByCity',countByCity)

router.get('/countByType',countByType)


module.exports  = router