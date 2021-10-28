const nodemailer =require('nodemailer');
let { nodemailer_passkey} = process.env        
// let { nodemailer_passkey } = require("../secrets");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// https - 443 http 8080
//userObj-> name email password 
module.exports=async function signUpMail(userObj) {
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'utsav2832@gmail.com', // generated ethereal user
      pass: nodemailer_passkey, // generated ethereal password
    },
  });

  var Osubject,Otext,Ohtml;

  Osubject=`Thank you for signing ${userObj.name}`;
  Otext=`
   Hope you have a good time !
   Here are your details-
   Name - ${userObj.name}
   Email- ${userObj.email}
   `
  Ohtml=`<h1>Welcome to foodAp.com </h1>
  <h1>Have a nice day</h1>`

  let info = await transporter.sendMail({
    from: '"FoodApp 🍱" <utsav2832@gmail.com>',// sender address <${userObj.email}>
    to: `${userObj.email}`, // list of receivers
    subject: Osubject, // Subject line
    text: Otext, // plain text body
    html: Ohtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
};


