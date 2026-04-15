import express from "express";
import protect from "../middleware/auth.js";
import { getConversations, getMessages, sendMessage } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/conversations",           protect, getConversations);
chatRouter.get("/messages/:conversationId", protect, getMessages);
chatRouter.post("/send",                   protect, sendMessage);

export default chatRouter;
