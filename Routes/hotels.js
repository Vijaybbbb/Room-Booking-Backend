const express = require('express')
const router = express.Router()
const Hotels = require('../Model/hotel.js')

//create hotel
router.post('/',async(req,res)=>{
       const newHotel  = req.body
       try {
            await Hotels.create(newHotel)  
            res.status(200)
       } catch (error) {
              res.status(500).json(error)
       }
})


//update hotel

router.put('/:id',async(req,res)=>{
       const updatedHotel = await  Hotels.findByIdAndUpdate(req.params.id,{$set : req.body})
       try {
            await Hotels.create(newHotel)  
            res.status(200)
       } catch (error) {
              res.status(500).json(error)
       }
})




module.exports  = router