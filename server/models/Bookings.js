import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types;
const bookingSchema = new mongoose.Schema({
    car : {type: ObjectId , ref:"Cars" , required:true},
    user : {type: ObjectId , ref:"User" , required:true},
    owner : {type: ObjectId , ref:"User" , required:true},
    pickupDate : {type:Date , required:true},
    returnDate : {type:Date , required:true},
    status : {type:String , enum:["pending", "confirmed", "cancelled", "completed"] , default:"pending"},
    price : {type:Number , required:true},
    paymentStatus: {type: String, enum: ["pending", "paid", "failed"], default: "pending"},
    paymentMethod: {type: String, enum: ["qr", "upi", "card", "cash"]},
    transactionId: {type: String},
    currency: {type: String, default: "USD"}
}, {timestamps:true});

const Bookings = mongoose.model("Booking" , bookingSchema);
export default Bookings;