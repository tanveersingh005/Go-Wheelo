import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import ChatBox from "../../components/ChatBox";
import { motion, AnimatePresence } from "framer-motion";

const Messages = () => {
    const { token, axios, user } = useAppContext();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get("/api/chat/conversations");
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error("Fetch conversations fail:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // refresh every 10s
        return () => clearInterval(interval);
    }, [token]);

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="px-5 py-8 md:px-10 md:py-10 pb-28 md:pb-12 min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mb-2">Communication Hub</p>
                <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                    Messages
                </h1>
                <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-600 font-medium">
                    Manage all your conversations with customers in one place.
                </p>
            </div>

            <div className="max-w-5xl">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
                        <p className="text-5xl mb-4">💬</p>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-white">No messages yet</h3>
                        <p className="text-sm text-zinc-400 dark:text-zinc-600 mt-2">When customers inquire about your cars, they'll appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Conversation List */}
                        <div className="lg:col-span-1 space-y-3">
                            <AnimatePresence>
                                {conversations.map((conv) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={conv.conversationId}
                                        onClick={() => setActiveChat(conv)}
                                        className={`group cursor-pointer p-4 rounded-[28px] border transition-all duration-300 ${
                                            activeChat?.conversationId === conv.conversationId
                                                ? "bg-white dark:bg-zinc-800 border-blue-600/30 dark:border-blue-400/30 shadow-xl shadow-blue-500/5 ring-2 ring-blue-600 dark:ring-blue-500 scale-[1.02]"
                                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shadow-inner">
                                                    <img src={conv.other.image} alt={conv.other.name} className="w-full h-full object-cover" />
                                                </div>
                                                {conv.unread > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-[11px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-lg">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-black truncate text-zinc-900 dark:text-white">
                                                        {conv.other.name}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 whitespace-nowrap ml-2">
                                                        {timeAgo(conv.lastMessage.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 opacity-60">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                                    <p className="text-[10px] font-black truncate uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                                                        {conv.carName}
                                                    </p>
                                                </div>
                                                <p className={`text-xs mt-2 truncate ${
                                                    conv.unread > 0 
                                                    ? "font-black text-zinc-900 dark:text-white" 
                                                    : "text-zinc-500 dark:text-zinc-400 font-medium"
                                                }`}>
                                                    {conv.lastMessage.sender === user._id ? "You: " : ""}{conv.lastMessage.text}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Active Chat Detail (Placeholder or Desktop Preview) */}
                        {/* <div className="hidden lg:block lg:col-span-2">
                            {activeChat ? (
                                <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 h-[600px] flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-24 h-24 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-5xl mb-6 shadow-inner">
                                        💬
                                    </div>
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                                        Chat with {activeChat.other.name}
                                    </h3>
                                    <p className="text-sm text-zinc-400 dark:text-zinc-600 mt-3 max-w-sm font-medium">
                                        Conversation regarding the <strong>{activeChat.carName}</strong>.
                                        Click the chat bubble that appeared to open the messaging window.
                                    </p>
                                    <button 
                                        onClick={() => setActiveChat(null)}
                                        className="mt-8 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90 transition shadow-lg"
                                    >
                                        Close Conversation
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-zinc-100/50 dark:bg-zinc-900/30 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 h-[600px] flex flex-col items-center justify-center p-12 text-center">
                                    <p className="text-5xl opacity-20 mb-4 animate-pulse">📪</p>
                                    <p className="text-sm font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">Select a conversation to start chatting</p>
                                </div>
                            )}
                        </div> */}
                    </div>
                )}
            </div>

            {/* Chat Overlay */}
            {activeChat && (
                <ChatBox
                    receiverId={activeChat.other._id}
                    carId={activeChat.car?._id || activeChat.lastMessage.carId}
                    carName={activeChat.carName}
                    onClose={() => {
                        setActiveChat(null);
                        fetchConversations();
                    }}
                />
            )}
        </div>
    );
};

export default Messages;
