import express from "express";
import protect from "../middleware/auth.js";
import {
    getNotifications,
    markNotificationsRead,
    clearNotifications,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/",            protect, getNotifications);
notificationRouter.post("/mark-read",  protect, markNotificationsRead);
notificationRouter.delete("/clear",    protect, clearNotifications);

export default notificationRouter;
