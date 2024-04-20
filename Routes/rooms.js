const express = require('express')
const router = express.Router()
const {createRoom,
       updateRoom,
       deleteRoom,
       updateRoomAvailability,
       getSingleRoom
} = require('../Controller/room')
const {verifyTocken}  = require('../utils/verifyTocken.js')

//create room
router.post('/createRoom/:id',createRoom)

//update room
router.put('/updateRoom/:id/:hotelId',updateRoom)

//delete room
router.delete('/deleteRoom/:id/:hotelId',deleteRoom)

router.put('/availability/:id',updateRoomAvailability)


router.get('/singleRoom/:id',getSingleRoom)



module.exports  = router