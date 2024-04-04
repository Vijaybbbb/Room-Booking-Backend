const express = require('express')
const router = express.Router()
const {register,
       login,
       otpVerify,
       otpResend,
       passwordReset,
       newPasswordSet
        } = require('../Controller/auth.js')

const {verifyTocken}  = require('../utils/verifyTocken.js')
const { session } = require('../utils/session.js')

//register User             
 router.post('/register', register)


//Login User
router.post('/login',login)

//otp verify
router.post('/otpVerify', otpVerify)

//otp resend
router.post('/otpResend', otpResend)

//password reset
router.post('/passwordReset',passwordReset)

//new Password setting
router.post('/newPasswordSet',newPasswordSet)


module.exports  = router