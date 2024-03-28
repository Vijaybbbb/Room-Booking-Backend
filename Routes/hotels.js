const express = require('express')
const router = express.Router()


router.get('/',(req,res)=>{
       res.send('hotels')
})




module.exports  = router