const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const MessageModel = mongoose.model('Messages', messageSchema)
module.exports = MessageModel;