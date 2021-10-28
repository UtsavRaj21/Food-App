// dependency
const express = require("express");
const planModel =
    require("../models/planModel")
    const { createElement, deleteElement, updateElement, getElement, getElements } = require('../helpers/factory')
    // router
const planRouter = express.Router();
const { protectedRoute, bodyChecker ,isAuthorized} = require("./authHelper");


 //import
const createPlan = createElement(planModel);
const deletePlan= deleteElement(planModel);
const updatePlan = updateElement(planModel);
const getPlan = getElement(planModel);
const getPlans = getElements(planModel);

// routes
planRouter.use(protectedRoute)

planRouter
    .route('/')
    .post(bodyChecker, createPlan)
    // localhost/user -> get
     .get( getPlans); // ce->customer executive

planRouter
    .route('/sortByRating')
    .get(getBestPlan)

planRouter
    .route("/:id")
    .get(getPlan)
    .patch(bodyChecker,isAuthorized(["admin","ce"]), updatePlan)
    .delete(bodyChecker,isAuthorized(["admin"]), deletePlan)

async function getBestPlan(req,res){
    try{
        console.log("bestPlan");
        let plans = await planModel.find()
                    .sort("-averageRating").populate({
                        path:'reviews',
                        select:'review'
                    })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
module.exports = planRouter;