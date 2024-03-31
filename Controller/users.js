 const otpVerify = async(req,res,next) =>{
       const email = req.query.email;

       const hashedPassword = await bcrypt.hash(password, 10)
              const newUser = {
                     userName: username,
                     email: email,
                     password: hashedPassword
              }
              await User.create(newUser)
              res.status(200).json({ message: 'User Hasbeen created' })
 }


 module.exports = {
       otpVerify
 }