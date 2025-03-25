const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true  // it means when  we get data from database it will not show the password
    },
    image: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    }
});




// define the model or the collection name
const User = new mongoose.model("User", userSchema);

module.exports = User;