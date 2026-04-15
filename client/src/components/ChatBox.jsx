import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(import.meta.env.VITE_BASE_URL || "http://localhost:8001");

const ChatBox = ({ receiverId, carId, carName, onClose }) => {
    const { user, token, axios, fetchUser } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [conversationId, setConversationId] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();

    const buildConvId = (uId, oId, cId) =>
        [uId, oId, cId].map(String).sort((a, b) => a.localeCompare(b)).join("_");

    useEffect(() => {
        if (!user || !receiverId || !carId) return;

        const convId = buildConvId(user._id.toString(), receiverId, carId);
        setConversationId(convId);
        socket.emit("join_conversation", convId);

        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`/api/chat/messages/${convId}`);
                if (data.success) {
                    setMessages(data.messages);
                }
            } catch (err) {
                console.error("Fetch messages fail:", err);
            }
        };
        fetchMessages();

        const handleNewMessage = (data) => {
            if (data.conversationId === convId) {
                setMessages((prev) => [...prev, data]);
            }
        };
        socket.on("receive_message", handleNewMessage);

        return () => {
            socket.off("receive_message", handleNewMessage);
        };
    }, [user, receiverId, carId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const { data } = await axios.post("/api/chat/send", {
                receiverId,
                carId,
                carName,
                text
            });

            if (data.success) {
                const newMsg = data.message;
                socket.emit("send_message", { ...newMsg, conversationId });
                setText("");
            }
        } catch (err) {
            console.error("Send message fail:", err);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[400px] max-md:right-0 max-md:bottom-0 max-md:w-full z-[150] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col h-[600px]"
        >
            {/* Header - Glassmorphism style */}
            <div className="px-6 py-5 bg-zinc-50/50 dark:bg-zinc-800/50 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 uppercase ring-2 ring-white dark:ring-zinc-800">
                            {carName?.charAt(0) || "C"}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-50 leading-none tracking-tight">{carName}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Active now</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="p-2.5 bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all border border-zinc-200 dark:border-zinc-700 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar bg-zinc-50/30 dark:bg-zinc-950/20">
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center p-8"
                        >
                            <div className="w-20 h-20 rounded-[32px] bg-white dark:bg-zinc-800 flex items-center justify-center text-4xl shadow-xl shadow-zinc-200/50 dark:shadow-none mb-6">
                                💬
                            </div>
                            <div>
                                <h5 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">Your Direct Line to Host</h5>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-2 max-w-[200px] leading-relaxed">Ask about vehicle specs, pickup details, or custom requests.</p>
                            </div>
                        </motion.div>
                    ) : (
                        messages.map((m, idx) => {
                            const isMe = m.sender._id === user?._id || m.sender === user?._id;
                            const showTime = idx === 0 || 
                                new Date(m.createdAt) - new Date(messages[idx-1].createdAt) > 600000;

                            return (
                                <motion.div 
                                    key={m._id || idx}
                                    layout
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                >
                                    {showTime && (
                                        <p className="w-full text-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 my-4">
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                    <div className={`group relative max-w-[85%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed transition-all ${
                                        isMe 
                                        ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10" 
                                        : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-tl-none shadow-sm shadow-zinc-200/50 dark:shadow-none"
                                    }`}>
                                        {m.text}
                                        
                                        {/* Timestamp on hover */}
                                        <span className={`absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[9px] font-bold text-zinc-400 ${isMe ? "right-0" : "left-0"}`}>
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    
                                    {isMe && idx === messages.length - 1 && (
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700 mt-1.5 mr-1 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-blue-500">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.01-5.5z" clipRule="evenodd" />
                                            </svg>
                                            Sent
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
                <div ref={scrollRef} className="h-0" />
            </div>

            {/* Input - More Integrated Look */}
            <div className="p-5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <form onSubmit={handleSend} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent px-4 py-2.5 text-[13px] font-medium outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                    />
                    <button 
                        type="submit" 
                        disabled={!text.trim()}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.163-.013.004a11.127 11.127 0 001.03 3.635l-.013.003h11.23a.75.75 0 000-1.5H6.987a9.626 9.626 0 01-.84-2.835L3.478 2.405z" />
                          <path d="M3.478 21.595a.75.75 0 01-.926-.94l2.432-7.163-.013-.004a11.127 11.127 0 011.03-3.635l-.013-.003h11.23a.75.75 0 010 1.5H6.987a9.626 9.626 0 00-.84 2.835l-2.669 7.85z" />
                        </svg>
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ChatBox;
