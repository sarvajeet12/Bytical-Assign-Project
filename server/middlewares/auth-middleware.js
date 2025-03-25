const jwt = require("jsonwebtoken");


const authMiddleware = (req, resp, next) => {

    let token = req.header("Authorization");

    if (token == "Bearer") {
        resp.status(401).json({ message: "Please Login First" });
        return;
    }

    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trim(); // Remove "Bearer " prefix 
    }

    // if token missing
    if (!token) {
        return resp.status(404).json({
            success: false,
            message: "Token Not Found"
        });
    }

    console.log("token", token)

    try {
        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // console.log(decode);

            req.user = decode;

        } catch (error) {
            return resp.status(401).json({
                success: false,
                message: "Token Is Invalid"
            })
        }

        next(); // go to next function or next middleware
    } catch (error) {
        // console.log("Something went wrong while validation the token: ", error);
        return resp.status(401).json({
            success: false,
            message: error.message
        })
    }
};


module.exports = authMiddleware;