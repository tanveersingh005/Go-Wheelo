import moongose from "mongoose";

const connectDB = async () => {
    try {
        moongose.connection.on('connected' , ()=> console.log("Database Connected"));
        await moongose.connect(process.env.MONGODB_URI)
    } catch(error){
        console.log(error.message);
    }
}

export default connectDB;