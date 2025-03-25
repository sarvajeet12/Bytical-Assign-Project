// Requires
require("dotenv").config()
const express = require('express');
const app = express();
const port = process.env.PORT;
const connectDB = require("./configs/db-config");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");

//1. for deployment purpose (require path)
const path = require("path");

//2. for deployment purpose (take path)
const _dirname = path.resolve();
// console.log("path", _dirname)

// socket.io configuration
const { createServer } = require('http');
const { Server } = require('socket.io');


// tackle cors
const corsOption = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
};


// middleware
app.use(express.json());
app.use(cors(corsOption))


// Router Path
const userRouter = require("./routers/user-router");
const messageRouter = require("./routers/messages-router");


// Routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

// --------------------------- Socket.io connection ----------------------
// Create HTTP Server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type'],
    },
});


let users = []
const addUsers = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId })
}
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}
const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}
io.on('connection', (socket) => {
    // when connected
    console.log('a user connected', socket.id)
    socket.on('AddUserSocket', (userId) => {
        console.log('userid', userId)
        addUsers(userId, socket.id)
        io.emit('getUsers', users)
        console.log('usersfromscoket', users)

    })
    // message
    socket.on('sendMessage', (data) => {
        const { senderId, receiverId, message } = data.messageData;
        console.log('revierId', receiverId)
        const user = getUser(receiverId);
        console.log('senderUser', user)
        if (user?.socketId) {
            io.to(user.socketId).emit('receiveMessage', {
                userId: senderId,
                message,
            });
        } else {
            console.log('Receiver not connected');
        }
        console.log('messagedata', data);
    });

    // when desction
    socket.on('disconnect', () => {
        console.log('a user disconnected')
        removeUser(socket.id)
        io.emit('getUsers', users)
        console.log(users)
    })
})

//3. for deployment purpose
app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, resp) => {
    resp.sendFile(path.resolve(_dirname, "client", "dist", "index.html"))
});



// centralized error detect
app.use(errorMiddleware)




// If database connected successfully THEN run "app.listen"
connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});