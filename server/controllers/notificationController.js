import Notification from "../models/Notification.js";

// ─── Helper: create one notification ──────────────────────────────────────────
export const createNotification = async ({ recipient, sender, type, title, message, bookingId, carName }) => {
    try {
        await Notification.create({ recipient, sender, type, title, message, bookingId, carName });
    } catch (e) {
        console.error("Notification create error:", e.message);
    }
};

// ─── GET /api/notifications ── fetch all for the logged-in user (newest first)
export const getNotifications = async (req, res) => {
    try {
        const { _id } = req.user;
        const notifications = await Notification.find({ recipient: _id })
            .sort({ createdAt: -1 })
            .limit(50);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ─── POST /api/notifications/mark-read ── mark one or all as read
export const markNotificationsRead = async (req, res) => {
    try {
        const { _id } = req.user;
        const { notificationId } = req.body; // optional — if omitted, mark all

        if (notificationId) {
            await Notification.findOneAndUpdate(
                { _id: notificationId, recipient: _id },
                { isRead: true }
            );
        } else {
            await Notification.updateMany({ recipient: _id, isRead: false }, { isRead: true });
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ─── DELETE /api/notifications/clear ── delete all for user
export const clearNotifications = async (req, res) => {
    try {
        const { _id } = req.user;
        await Notification.deleteMany({ recipient: _id });
        res.json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
