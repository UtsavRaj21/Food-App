//npm install jsonwebtoken

const express = require('express');
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
//After deploy process.env ,, At local -> require
const { JWT_Key } =process.env         //|| require('../secrets')
var path = require('path');

const signUpMail = require('../helpers/signupMail')
const forgetPassMail = require('../helpers/forgetPassWordMail')

//---------Routes -----------------
authRouter
    .route('/signup')
    .post(setCreatedAt, signUpUser)


authRouter
    .route('/forgetPassword')
    .get(getforgetUser)
    .post(postforgetUSer, forgetPassword)

authRouter
    .route('/resetPassword')
    .get(getResetUser)
    .post(resetPassword)

authRouter
    .route('/login')
    .post(loginUser);

//------ functions -----------------

function setCreatedAt(req, res, next) {
    let obj = req.body;
    //keys ka arr 
    let length = Object.keys(obj).length;
    if (length == 0) {
        return res.status(400).json({ message: "cannot create user" })
    }
    req.body.createdAt = new Date().toISOString();
    next();
}

async function signUpUser(req, res) {
    // let userDetail =req.body;
    // let name = userDetail.name;
    // let email = userDetail.email;
    // let password = userDetail.password;

    // let { email, name, password } = req.body;
    // user.push({ email, name, password });
    // console.log('user', req.body);
    // res.json({
    //     message: 'user Signed Up',
    //     user: req.body
    // })

    try {
        let password = req.body.password;
        
        
        let userObj = req.body;
        //create document in userModel
        let user = await userModel.create(userObj)
        signUpMail(user).catch(console.error);
        console.log('user', userObj);
        return res.json({
            message: 'user Signed Up',
            user: userObj
        })
    }
    catch (err) {
        console.log(err);
        res.json({ message: err.message })
    }
}



function getforgetUser(req, res) {
    //res.sendFile('../public/forgetPass.html', { root: __dirname })
    res.sendFile(path.resolve('public/forgetPass.html'));
}

function postforgetUSer(req, res, next) {
    let data = req.body;
    console.log(data);

    //check email is valid or not
    next();
    // res.json({
    //     message: "data",
    //     data: data.email
    // })
}

async function forgetPassword(req, res) {
    try {
        let { email } = req.body;
        // search on the basis of email
        let user = await userModel.findOne({ email })
        if (user) {
            let token = 
            (Math.floor(Math.random() * 10000) + 10000)
                .toString().substring(1);
                // date.now ->300
            let updateRes = await userModel.updateOne({ email },{ token})
            //    console.log("updateQuery",updateRes)
            // 
            let newUser = await userModel.findOne({ email });
            // console.log("newUser", newUser)
            // email
            // email send
            await forgetPassMail(token, user.email);
            console.log(newUser)
            res.status(200).json({
                message: "user token send to your email",
                user: newUser,
                token
            })
        } else {
            res.status(404).json({
                message:
                    "user not found with creds"
            })
        }
        // create token
        // -> update the user with a new token 
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}

function getResetUser(req, res) {
    //res.sendFile('../public/forgetPass.html', { root: __dirname })
    res.sendFile(path.resolve('public/resetPass.html'));
}


async function resetPassword(req, res) {
    // token,confirmPassword,password
    // 10 lakh -> 10 lakh users
    // frontend -> local storage  
    try {
        
        let { token, password,confirmPassword  } = req.body;
        console.log({token})
        let user = await userModel.findOne({ token });
         console.log("user 142", user);
        if (user) {
            // await userModel.updateOne({ token }, {
            //     token: undefined,
            //     password: password,
            //     confirmPassword: confirmPassword,
            // },{runValidators:true} )
            // server
            // user.resetHandler(password,confirmPassword);
            user.password = password;
            user.confirmPassword = confirmPassword;
            user.token = undefined;
            
            //console.log("newUser", user)
            // database entry 
            await user.save();
            let newUser = await userModel.findOne({ email: user.email });
            console.log("newUser", newUser)
            // email
            // email send
            // await emailSender(token, user.email);
            res.status(200).json({
                message: "password update",
                user: newUser,
            })
        }else{
            //console.log("168",user);
            res.status(500).json({
                message: "user not find"
            })
        }

    } catch (err) {
        //console.log(err.message);
        res.status(500).json({
            message: err.message
        })
    }
}

//sha 256 algorithm
async function loginUser(req, res) {
    //email,password
    try {
        if (req.body.email) {
            let user = await userModel.findOne({ email: req.body.email })
            if (user) {
                let areEqual = await bcrypt.compare(req.body.password,user.password); // user.password -> backend  ,,, req.body.password = frontend password
                if ( areEqual) {  
                    let payload = user['_id'];
                    let token = jwt.sign({ id: payload }, JWT_Key)
                    res.cookie('login', token, { httpOnly: true })   // HttpOnly is a flag added to cookies that tell the browser not to display the cookie through client-side scripts (document. cookie and others)
                    return res.json({
                        message: "user Logged in"
                    })
                } else {
                    console.log("loginFalse")
                    return res.json({
                        message: "email or password is wrong"
                    })
                }
            } else {
                return res.json({
                    message: "email is wrong"
                })
            }
        }
    } catch (err) {
        return res.json({
            message: err.message,
        })
    }
}
module.exports = authRouter;

