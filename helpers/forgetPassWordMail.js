const nodemailer =require('nodemailer');
const {nodemailer_passkey}= process.env         //||require('../secrets');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// https - 443 http 8080
//userObj-> name email password 
module.exports = async function forgetPassMail(token, userEmail) {
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'utsav2832@gmail.com', // generated ethereal user
      pass: nodemailer_passkey, // generated ethereal password
    },
  });

  // var Osubject,Otext,Ohtml;

  // Osubject=`Thank you for signing ${userObj.name}`;
  // Otext=`
  //  Hope you have a good time !
  //  Here are your details-
  //  Name - ${userObj.name}
  //  Email- ${userObj.email}
  //  `
  // Ohtml=`<h1>Welcome to foodAp.com</h1>`

  // let info = await transporter.sendMail({
  //   from: '"FoodApp 🍱" <utsav2832@gmail.com>',// sender address <${userObj.email}>
  //   to: "utsav11115@gmail.com", // list of receivers
  //   subject: Osubject, // Subject line
  //   text: Otext, // plain text body
  //   html: Ohtml, // html body
  // });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" ', // sender address
    to: "utsav11115@gmail.com", // list of receivers
    subject: "Token for reset", // Subject line        
    text: "Hello world?", // plain text body
    html:
        `<b></b> 
        <p>your reset token is
    <br>${token}</br>
    </p>`, // html body
   });
console.log("Message sent: %s", info.messageId);
  
};


