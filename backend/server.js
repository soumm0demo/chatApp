const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const { protect } = require('./middlewares/auth');



//
require('dotenv').config();

const PORT = process.env.PORT;

//middlewares
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieparser())
app.use(fileUpload({ useTempFiles: true }))

//db connect
const { connectDB } = require('./config/dbConnect');
connectDB();
// cloudinary connect 
const { cloudinaryConnect } = require('../backend/config/cloudinaryConnect');
cloudinaryConnect();

// mounting
const authRouter = require('./routes/User');
const messageRouter = require('./routes/Message');


app.use("/api/v1", authRouter)
app.use("/api/v1", messageRouter);

//  socket functionality
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust based on frontend URL
        methods: ["GET", "POST"],
    },
});


let allUser = {};

io.on("connection", (socket) => {
    console.log("new connection established:: id -> ", socket.id);

    io.emit("update-user", allUser); // 🔹 ADD THIS LINE

    socket.on("disconnect", () => { // 🔹 FIXED (Removed destructuring, `{ userId }` was incorrect)
        for (let userId in allUser) {
            if (allUser[userId] === socket.id) {
                delete allUser[userId];
                
                // ✅ Emit updated allUser list after disconnection
                io.emit("update-user", allUser); // 🔹 ADD THIS LINE
                break;
            }
        }
        console.log("connection disconnected->", socket.id);
    });
    socket.on('register-user', ({ userId }) => {
        allUser[userId] = socket.id;
        // console.log("New user added");
        console.log(allUser);
        io.emit("update-user" , allUser)
    })

    socket.on('send-message', ({ recipientSocketId, message, id }) => {
        console.log(allUser);
        // console.log(recipientSocketId , "::: socketid of reciver");
        // console.log("from backend ::"  ,allUser[id]);
        // console.log(id);

        const actualId = allUser[id];

        if (actualId) {
            io.to(actualId).emit('receive-message', {
                senderId: socket.id,
                message: message
            });
            console.log(`Message sent to user ${message}`);
        } else {
            console.log(`User ${actualId} ::  not connected`);
        }
    });

})




server.listen(PORT, () => {
    console.log(`app started at ${PORT}`);
})

app.get("/", protect, (req, res) => {
    try {
        console.log("hitted");
        res.status(200).json({
            success: true,
            message: "Welcome to the home route"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})



