//npm i email-validator
const mongoose=require('mongoose');
const {db_link}=process.env         //||require('../secrets');
const validator = require("email-validator"); // for check email is vaild or not

mongoose.connect(db_link).then(function(db){
    // console.log(db);
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const planSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:[true,"plan name should be unique"],
        required:[true,"kindly pass the name"]
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        validate:{
            validator:function(){
                return this.discount < this.price
            },
            message:"discount should be less then actual price"
        }
    }, 
    role: {
        type: String,
        enum: ["admin", "ce", "user"],
        default: "user"
    },
    planImages : {
        type:String
    },
    reviews:{
        type:[mongoose.Schema.ObjectId]
    },
    averageRating:Number

})

// planSchema.pre('save', function (next) {
//     next();
// });

const planModel=mongoose.model('PlanModel',planSchema);

module.exports = planModel;