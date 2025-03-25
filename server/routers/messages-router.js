const express = require("express");
const router = express.Router();

const messagesController = require("../controllers/messages-controller")


// send message
router
    .route("/send-message")
    .post(messagesController.SendMessage);



// get message  
router
    .route("/get-message")
    .post(messagesController.getMessages);




module.exports = router;
