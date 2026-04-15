import Message from "../models/Message.js";
import { createNotification } from "./notificationController.js";

// Build a stable conversationId regardless of who calls first
export const buildConvId = (userId, ownerId, carId) =>
    [userId, ownerId, carId].map(String).sort((a, b) => a.localeCompare(b)).join("_");

// GET /api/chat/conversations
// Returns all distinct conversations the logged-in user is part of
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        // Find all messages where user is sender or receiver, group by conversationId
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .sort({ createdAt: -1 })
        .populate("sender", "name image")
        .populate("receiver", "name image")
        .populate("carId", "brand model image");

        // Deduplicate by conversationId, keeping only latest message per convo
        const seen = new Set();
        const conversations = [];
        for (const msg of messages) {
            if (!seen.has(msg.conversationId)) {
                seen.add(msg.conversationId);
                // Unread count for this conversation  
                const unread = await Message.countDocuments({
                    conversationId: msg.conversationId,
                    receiver: userId,
                    isRead: false,
                });
                conversations.push({ 
                    conversationId: msg.conversationId,
                    lastMessage: msg,
                    unread,
                    car: msg.carId,
                    carName: msg.carName,
                    other: msg.sender._id.toString() === userId ? msg.receiver : msg.sender,
                });
            }
        }

        res.json({ success: true, conversations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/chat/messages/:conversationId
// Returns all messages in a conversation and marks them as read
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 })
            .populate("sender", "name image");

        // Mark all unread messages FROM the other person as read
        await Message.updateMany(
            { conversationId, receiver: userId, isRead: false },
            { isRead: true }
        );

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/chat/send
// Save a message to DB (Socket.io handles real-time delivery separately)
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, carId, carName, text } = req.body;
        const senderId = req.user._id;

        if (!text?.trim()) return res.json({ success: false, message: "Empty message" });

        const conversationId = buildConvId(senderId.toString(), receiverId, carId);

        const message = await Message.create({
            conversationId,
            sender: senderId,
            receiver: receiverId,
            text: text.trim(),
            carId,
            carName,
        });

        await message.populate("sender", "name image");

        // Trigger notification for the receiver
        await createNotification({
            recipient: receiverId,
            sender:    senderId,
            type:      "new_message",
            title:     "New Message Received",
            message:   `You have a new message from ${message.sender?.name || "a user"} regarding ${carName || "a car"}.`,
            carName:   carName,
        });

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
