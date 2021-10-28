// requirments
const express = require('express');
let reviewRouter = express.Router();
let reviewModel = require("../models/reviewModel")
const { protectedRoute, bodyChecker, isAuthorized } = require("./authHelper");
const { 
    getElement, getElements,
    updateElement } = require("../helpers/factory");
const planModel = require('../models/planModel');

// const createReview = createElement(reviewModel);
// const deleteReview = deleteElement(reviewModel);
const updateReview = updateElement(reviewModel);
const getReview = getElement(reviewModel);
const getReviews = getElements(reviewModel);

const createReview = async function(req,res){
    try{
        let review = await reviewModel.create(req.body);
        
        let planid = review.plan;
        let plan = await planModel.findById(planid);
        plan.reviews.push(review["_id"]);
        if(plan.averageRating){
            let sum = plan.averageRating * plan.reviews.length;
            let finalAvgRating = (sum+review.rating)/(plan.reviews.length+1);
            plan.averageRating = finalAvgRating;
        }else{
            plan.averageRating = review.rating;
        }

        await plan.save();
        res.status(200).json({
            message:"review Created",
            review:review
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

const deleteReview = async function(req,res){
    try{
        let review = await reviewModel.findByIdAndDelete(req.body.id);
        let planid = review.plan;
        let plan = await planModel.findById(planid);
        let idOfReview= plan.reviews.indexOf(review["_id"]);
        plan.review.splice(idOfReview,1);
        await plan.save();
        res.status(200).json({
            message:"review deleted",
            review:review
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
    

}
// routes-> id
reviewRouter.use(protectedRoute);

reviewRouter
    .route("/:id")
    .get(getReview)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateReview)
    .delete(bodyChecker, isAuthorized(["admin"]), deleteReview)

    //*************************************************************** */

    reviewRouter
    .route('/')
    .post(bodyChecker, createReview)
    .get(getReviews);



module.exports = reviewRouter;