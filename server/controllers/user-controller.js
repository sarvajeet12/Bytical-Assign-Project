const user = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// TODO: ------------------------ User Register Page Logic -----------------------------------------------------

const register = async (req, resp) => {
    try {

        const { name, email, password } = req.body;

        // check user exists or not
        const userExist = await user.findOne({ email });

        if (userExist) {
            return resp.status(400).json({ success: false, message: "User already register" });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);


        //Get initial character
        let initial = '';
        if (name.charAt(0) === 'H' || name.charAt(0) === 'h' || name.charAt(0) === 'S' || name.charAt(0) === 's') {
            initial = name.charAt(0).toUpperCase();
        } else {
            initial = name.charAt(0).toLowerCase();
        }


        //else
        const userCreated = await user.create({
            name,
            email,
            password: hashPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${initial}`,
        });

        resp.status(200).json({
            success: true,
            message: "Register Successfully",
            response: userCreated,
        })

    } catch (error) {
        console.log("Error Occurs while singUp: ", error);
        next(error)
    }
}


// TODO: -------------------------------------- User Login Page Logic -------------------------------------------

const login = async (req, resp) => {
    try {

        const { email, password } = req.body;

        const userExist = await user.findOne({ email: email });

        if (!userExist) {
            return resp.status(400).json({ success: false, message: "Invalid email or password" });

        }

        // password comparing frontend password and db password
        const isMatch = await bcrypt.compare(password, userExist.password);

        if (!isMatch) {
            return resp.status(401).json({ success: false, message: "Invalid email or password" })
        } else {
            const payload = {
                email: userExist.email,
                id: userExist._id,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: "30m",  //30min
            })

            await user.updateOne({ email: email }, { $set: { status: true } });

            resp.status(200).json({
                success: true,
                message: "User Login Successful",
                token: token,
                response: userExist,

            });
        }

    } catch (error) {
        console.log("Error Occurs while login: ", error);
        next(error)
    }
}


// TODO: ---------------------to send user data - User Logic (check which user log in) -------------------------

// const userDetails = async (req, resp) => {
//     try {
//         const userData = req.user;

//         const userEmail = userData.email;

//         const userDetails = await user.find({ email: userEmail }, { password: 0 })

//         resp.status(200).json({ success: true, response: userDetails });
//     } catch (error) {
//         console.log("Error Occurs while user data: ", error);
//         next(error)
//     }
// }

const getAllUserDetails = async (req, resp) => {
    try {
        const userData = await user.find();

        resp.status(200).json({ success: true, response: userData });
    } catch (error) {
        console.log("Error Occurs while user data: ", error);
        next(error)
    }
}








module.exports = { register, login, getAllUserDetails };