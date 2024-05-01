const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { adminLogin,
        adminHome,
        getAllUsers,
        getAllHotels,
        createNewUser, 
        createNewCoupen,
        getAllBookings,
        getAllCoupens,
        getSingleCoupen,
        updateCoupen} = require('../Controller/admin')
const { verifyTocken } = require('../utils/verifyTocken')


//admin login route
router.post('/login',adminLogin)

//admin Home Page Route
router.post('/adminHome',verifyTocken,adminHome)

//get all registered users
router.get('/users',getAllUsers)
 
//get all registered hotels
router.get('/hotels',getAllHotels)
 
router.post('/createUser',createNewUser)

router.post('/createCoupen',createNewCoupen)

router.get('/allBookings',getAllBookings)

router.get('/allCoupens',getAllCoupens)

router.get('/viewCoupen/:id',getSingleCoupen)

router.post('/updateCoupen/:id',updateCoupen)


module.exports  = router