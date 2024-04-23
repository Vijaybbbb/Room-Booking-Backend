const express = require('express')
const router = express.Router()
const {verifyTocken}  = require('../utils/verifyTocken.js')
const { getSingleUser,
       updateUser,
       deleteUser,
       createOrder,
        } = require('../Controller/users.js')


router.post('/checkAuthentication',verifyTocken,(req,res)=>{
       res.send('users')
})

router.get('/singleUser',getSingleUser)

router.put('/updateUser',updateUser)

router.delete('/deleteUser',deleteUser)

router.post('/createOrder',createOrder) 


module.exports  = router