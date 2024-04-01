const express = require('express')
const router = express.Router()
const {verifyTocken}  = require('../utils/verifyTocken.js')
const {otpVerify} = require('../Controller/users.js')


router.post('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})

router.post('/otpVerify',otpVerify)


module.exports  = router