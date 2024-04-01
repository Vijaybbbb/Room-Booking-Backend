const express = require('express')
const router = express.Router()
const {register,
       login,
       otpVerify
        } = require('../Controller/auth.js')
const { session } = require('../utils/session.js')

//register User             
 router.post('/register', register)


//Login User
router.post('/login',login)

router.post('/otpVerify', otpVerify)


module.exports  = router