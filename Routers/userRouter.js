// dependency
const express = require("express");
const userModel =
    require("../models/userModel")
// router
const userRouter = express.Router();
const { protectedRoute, bodyChecker, isAuthorized } = require("./authHelper");
const { createElement, deleteElement, updateElement, getElement, getElements } = require('../helpers/factory')

//import
const createUser = createElement(userModel);
const deleteUser = deleteElement(userModel);
const updateUser = updateElement(userModel);
const getUser = getElement(userModel);
const getUsers = getElements(userModel);


// routes
userRouter.use(protectedRoute)
userRouter
    .route('/')
    .post(bodyChecker, createUser)
    // localhost/user -> get
    .get(protectedRoute, isAuthorized(["admin", "ce"]), getUsers); // ce->customer executive
userRouter.route("/:id")
    .get(getUser)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateUser)
    .delete(bodyChecker, isAuthorized(["admin"]), deleteUser)


module.exports = userRouter;