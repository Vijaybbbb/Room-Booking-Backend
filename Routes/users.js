const express = require('express')
const router = express.Router()
const {verifyTocken}  = require('../utils/verifyTocken.js')

router.get('/',(req,res)=>{
       res.send('users')
})

//
router.get('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})


router.get('/otpVerify',(req,res)=>{
       const email = req.query.email;
       
})


module.exports  = router