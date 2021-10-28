const mongoose=require('mongoose');
let { db_link } = process.env        
// let { db_link } = require("../secrets");
const validator = require("email-validator"); // for check email is vaild or not

mongoose.connect(db_link).then(function(db){
    // console.log(db);
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contain some rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref: "UserModel"
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "PlanModel",       //populate -->> it gives our whole info about plan
        required: [true, "Review must belong to a plan "]
    }
});
const reviewModel = mongoose.model("ReviewModel", reviewSchema);

module.exports = reviewModel;