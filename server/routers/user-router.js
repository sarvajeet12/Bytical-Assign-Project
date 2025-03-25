const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user-controller")

// Validation path
const authValidation = require("../validations/auth-validation");


// middleware
const validate = require("../middlewares/validator-middleware");
const authMiddleware = require("../middlewares/auth-middleware");



// register page  
router
    .route("/register").
    post(validate(authValidation), userControllers.register);

// login page  
router
    .route("/login").
    post(userControllers.login);


// get all user data 
router
    .route("/all-user-details")
    .get(userControllers.getAllUserDetails);





module.exports = router; 