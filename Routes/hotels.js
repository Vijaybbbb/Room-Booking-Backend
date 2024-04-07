const express = require('express')
const router = express.Router()

const {createHotel,
       updatedHotel,
       getAllHotels,
       countByCity
}  = require('../Controller/hotels.js')


//create hotel
router.post('/',createHotel)

//update hotel
router.put('/find/:id',updatedHotel)

//get all hotels 
router.get('/',getAllHotels)

router.get('/countByCity',countByCity)

router.get('/countByType')


module.exports  = router