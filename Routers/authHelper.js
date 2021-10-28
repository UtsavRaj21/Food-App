 // is user logged in
 const jwt = require('jsonwebtoken');
 const {JWT_Key} = process.env         //|| require('../secrets');
 let userModel = require('../models/userModel')

 module.exports.protectedRoute = function protectedRoute(req, res, next) {
    try {
        if (req.cookies.login) {
            console.log(req.cookies)
            let isVerified = jwt.verify(req.cookies.login,JWT_Key)   // JWT verify
            if(isVerified){
                console.log(isVerified);
                let userId = isVerified.id;
                req.userId=userId
                next();
            }else{
                res.json({
                    message: " not allowed"
                })
            }
            
        } else {
             res.json({
                message: "opperation not allowed"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}



module.exports.bodyChecker = 
function bodyChecker(req, res, next) {
    console.log("reached body checker");
    let isPresent = Object.keys(req.body).length;
    console.log("ispresent", isPresent)
    if (isPresent) {
        next();
    } else {
        res.send("kind send details in body ");
    }
}

module.exports.isAuthorized = function isAuthorized(roles) {
    //console.log("I will run when the server is started")
    // function call 
    return async function (req, res) {
        console.log("I will run when a call is made ")
        let { userId } = req;
        // id -> user get ,user role,
        try {
            let user =userModel.findById(userId);
            let userisAuthorized = roles.includes(user.role);
            if (userisAuthorized) {
                req.user = user;
                next();
            } else {
                res.status(200).json({
                    message: "user not authorized"
                })
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}