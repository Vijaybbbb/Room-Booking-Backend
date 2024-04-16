const express = require('express')
const User = require('../Model/user')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const { adminLogin, adminHome } = require('../Controller/admin')
const { verifyTocken } = require('../utils/verifyTocken')


//admin login route
router.post('/login',adminLogin)

//admin Home Page Route
router.post('/adminHome',verifyTocken,adminHome)
 

module.exports  = router