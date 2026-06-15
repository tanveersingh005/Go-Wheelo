import moongose from "mongoose";

const connectDB = async () => {
    try {
        moongose.connection.on('connected', () => console.log("Database Connected"));
        moongose.connection.on('error', (err) => console.error("MongoDB connection error:", err));
        await moongose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4 — avoids IPv6 issues on Render
        });
    } catch(error){
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit so Render restarts the server instead of hanging
    }
}

export default connectDB;