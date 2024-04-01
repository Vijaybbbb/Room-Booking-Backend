const express = require('express')
const router = express.Router()
const {verifyTocken}  = require('../utils/verifyTocken.js')


router.post('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})




module.exports  = router