const express = require('express')
const router = express.Router()
const {verifyTocken}  = require('../utils/verifyTocken.js')


router.get('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})


router.get('/otpVerify',async(req,res)=>{
       const email = req.query.email;






       const hashedPassword = await bcrypt.hash(password, 10)
              const newUser = {
                     userName: username,
                     email: email,
                     password: hashedPassword
              }
              await User.create(newUser)
              res.status(200).json({ message: 'User Hasbeen created' })

})


module.exports  = router