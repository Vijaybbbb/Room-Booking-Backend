const express = require('express')
const router = express.Router()

const {createHotel,
       updatedHotel}  = require('../Controller/hotels.js')


//create hotel
router.post('/',createHotel)

//update hotel
router.put('/:id',updatedHotel)




module.exports  = router