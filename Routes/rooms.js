const express = require('express')
const router = express.Router()
const {createRoom,updateRoom,deleteRoom} = require('../Controller/room')

//create room
router.get('/createRoom',createRoom)

//update room
router.get('/updateRoom',updateRoom)

//delete room
router.get('/deleteRoom',deleteRoom)



module.exports  = router