//npm i email-validator
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const {db_link}=process.env         //||require('../secrets');
const validator = require("email-validator"); // for check email is vaild or not

mongoose.connect(db_link).then(function(db){
    // console.log(db);
    console.log('db connected');
})

.catch(function(err){
    console.log(err);
});

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    createdAt:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        //third party library
        validate:function(){
            return validator.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        min:8
    },
    confirmPassword:{
        type:String,
        required:true,
        min:8,
        validate:function(){
            return this.password==this.confirmPassword
        }
    },
    token: String,
    role: {
        type: String,
        enum: ["admin", "ce", "user"],
        default: "user"
    },
    bookings: {
        //   array of object id 
        type: [mongoose.Schema.ObjectId],
        ref: "bookingModel"
    },
    
});

// userModel me user save hone se pehle ye chalega
//if same password then it will not save in mongodb
// hook
userSchema.pre('save', function (next) {
    // do stuff
    const salt = await bcrypt.genSalt(10);
    //password convert text
    this.password = await bcrypt.hash(this.password);
    this.confirmPassword = undefined;
    next();
});
// document method
userSchema.methods.resetHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.token = undefined;
}
const userModel=mongoose.model('UserModel',userSchema);

module.exports = userModel;
// (async function createUser(){
//     let user={
//         name:'harsh',
//         age:20,
//         email:'harsh@gmail.com',
//         password:'12345678',
//         confirmPassword:'12345678'
//     };
//     let userObj=await userModel.create(user);
//     console.log(userObj);
// })();