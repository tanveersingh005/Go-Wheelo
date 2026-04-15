import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    // recipient of the notification
    recipient:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // sender (user who triggered the action, optional)
    sender:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // notification type for icon / colour coding
    type: {
        type: String,
        enum: [
            "booking_requested",   // owner gets this when user makes a booking
            "booking_confirmed",   // user gets this when owner confirms
            "booking_cancelled",   // other party gets this on cancel
            "booking_completed",   // user gets this when owner marks returned
            "new_message",         // for chat notifications
        ],
        required: true,
    },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    isRead:  { type: Boolean, default: false },
    // quick reference fields so the FE can build a link without extra fetches
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Bookings" },
    carName:   { type: String },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
