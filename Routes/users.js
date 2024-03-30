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


module.exports  = router