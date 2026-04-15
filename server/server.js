import express from "express";
import "dotenv/config";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
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
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Connect Databse //

await connectDB()

//Middleware //

app.use(cors({
    origin: "https://go-wheelo.netlify.app",
    credentials: true
}));
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
