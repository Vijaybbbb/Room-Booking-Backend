const express = require('express')
const router = express.Router()
const {verifyTocken}  = require('../utils/verifyTocken.js')
const { getSingleUser } = require('../Controller/users.js')


router.post('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})

router.get('/singleUser',getSingleUser)




module.exports  = router