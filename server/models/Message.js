import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    // Conversation is uniquely identified by the trio: user + owner + car
    conversationId: { type: String, required: true, index: true },
    sender:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Who should receive this message (for unread-count queries)
    receiver:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text:    { type: String, required: true, trim: true },
    isRead:  { type: Boolean, default: false },
    // References kept for convenience
    carId:   { type: mongoose.Schema.Types.ObjectId, ref: "Cars" },
    carName: { type: String },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
