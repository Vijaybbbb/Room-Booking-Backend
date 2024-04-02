const express = require('express')
const router = express.Router()
const {register,
       login,
       otpVerify,
       otpResend
       
        } = require('../Controller/auth.js')
const { session } = require('../utils/session.js')

//register User             
 router.post('/register', register)


//Login User
router.post('/login',login)

//otp verify
router.post('/otpVerify', otpVerify)

//otp resend
router.post('/otpResend', otpResend)



module.exports  = router