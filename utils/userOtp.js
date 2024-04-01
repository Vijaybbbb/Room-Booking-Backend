const nodeMailer  = require('nodemailer')



const generateOtp = () =>{
       return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

//nodemailer Setup
const transport = nodeMailer.createTransport({
       service: "gmail",
       auth: {
         user: 'blogify6@gmail.com', 
         pass: "qxpu eghk aemc tzmo",
       },
       secure: true, // Use TLS
       tls: {
         rejectUnauthorized: false, // Disable TLS certificate verification
       },
     });

//send otp to email
 const sendOtpToEmail = (email,otp) =>{
       return new Promise((resolve,reject)=>{
              const mailOptions = {
                     from: 'blogify6@gmail.com',
                     to: email,
                     subject: "OTP VERIFICATION",
                     text: `verify your email to signup ... YOUR OTP IS : ${otp}`
                   };
              transport.sendMail(mailOptions, (err) => {
                     if (err) {
                            reject(new Error("Failed to send OTP"));
                      } else {
                             console.log("OTP Sent successfully",otp);
                             resolve("OTP Sent successfully");
                      }
               });
       })
 }

 //verify otp
     



module.exports = {
       generateOtp,
       sendOtpToEmail
}