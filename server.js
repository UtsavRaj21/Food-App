 //npm install cookie-parser
const express = require('express');
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const app = express();
const helmet = require("helmet");
var xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize');


const cookieParser = require('cookie-parser')
app.use(cookieParser())   // request k object me cookies daal diya --> cookies is attach with request 

const userModel = require('./models/userModel')

// const router = express.Router();  
app.listen(process.env.PORT||5000, function () {
    console.log('server is Listening on port 5000')
})

//  denial-of-service (DDoS) attack
app.use(rateLimit({            
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:
    "Too many accounts created from this IP, please try again after an hour"
    })
)

//to set http headers
app.use(helmet());

//extra params na ho -->> Invalid paramter
app.use(hpp({
    whitelist:[
        'select',
        'page',
        'sort',
        'myquery'
    ]
    })
)



app.use(express.json());  // imp line  -->> front end jo data aa rha h json m padhe

/* make sure this comes before any routes */ //-- >> cross site scripting
app.use(xss()); 
 
// To remove data, use: -- >> mongo db query sanitizer
app.use(mongoSanitize());

// app.use((req,res,next)=>{
//     console.log('i m middleware');
//      next();                               //if we does not give any respose
// })
// let user = {};

app.use(express.static('public'))   // only show public folder
let user = [];

const authRouter = require('./Routers/authRouter')
const userRouter = require('./Routers/userRouter')
const planRouter = require('./Routers/planRouter')
const reviewRouter = require('./Routers/reviewRouter')
const bookingRouter = require('./Routers/bookingRouter')

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/plan', planRouter);
app.use('/review', reviewRouter);
app.use('/booking', bookingRouter);

//redirects
app.get('/user-all', (req, res) => {
    res.redirect('/user');
})

//top to bottom code run and at the end when route doesn't match then it will show erorr
//404 Page
app.use((req, res) => {
    //res.sendFile('public/404.html', { root: __dirname })
})



