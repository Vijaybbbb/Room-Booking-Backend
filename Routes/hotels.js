const express = require('express')
const router = express.Router()

const {createHotel,
       updatedHotel,
       getAllHotels
}  = require('../Controller/hotels.js')


//create hotel
router.post('/',createHotel)

//update hotel
router.put('/:id',updatedHotel)

//get all hotels 
router.get('/',getAllHotels)


module.exports  = router