import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRouter.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import { createServer } from "node:http";
import { Server } from "socket.io";


// Intitialize Express App //
const app = express()
const server = createServer(app);

const allowedOrigins = [
    "https://go-wheelo.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000"
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

const io = new Server(server, {
    cors: corsOptions
});


// Connect Databse //

await connectDB()

//Middleware //

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/chat', chatRouter)

// Socket.io logic //
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined room: ${conversationId}`);
    });

    socket.on("send_message", (data) => {
        // data should contain conversationId, sender, text, etc.
        io.to(data.conversationId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 8001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
