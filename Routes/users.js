const express = require('express')
const router = express.Router()
const {verifyTocken}  = require('../utils/verifyTocken.js')
const {otpVerify} = require('../Controller/users.js')


router.get('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})

router.get('/otpVerify',otpVerify)


module.exports  = router