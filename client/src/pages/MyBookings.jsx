/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import ChatBox from "../components/ChatBox";

const MyBookings = () => {
  const { axios, token } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { userId, carId, carName }

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const currency = import.meta.env.VITE_CURRENCY || "$";

  useEffect(() => {
    if (token) fetchMyBookings();
  }, [token]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-20 pt-16">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 text-sm max-w-7xl mx-auto">
        <Title
          title={"My Bookings"}
          subTitle={"View and manage your car bookings in your personal ledger."}
          align="left"
        />

        <div className="mt-8 flex flex-col gap-6">
          {bookings.map((booking, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 glass-panel rounded-2xl"
            >
              {/* CarImage + Info */}

              <div className="md:col-span-1">
                <div className="rounded-xl overflow-hidden mb-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={booking.car.image}
                    alt="car"
                    className="w-full h-auto aspect-video object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
                  {booking.car.brand} {booking.car.model}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                  {booking.car.year} • {booking.car.category} •{" "}
                  {booking.car.location}{" "}
                </p>
              </div>

              <div className="md:col-span-2 md:pl-4 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <p className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg font-medium text-xs tracking-wider uppercase">
                    Order #{index + 1}{" "}
                  </p>
                  <p
                    className={`px-3 py-1.5 text-xs rounded-lg font-bold uppercase tracking-wider ${booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : booking.status === "completed" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}
                  >
                    {booking.status}
                  </p>
                </div>
                <div className="flex items-start gap-4 mt-6">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 outline outline-1 outline-zinc-200 dark:outline-zinc-700/50">
                     <img
                       src={assets.calendar_icon_colored}
                       alt="calendar"
                       className="w-5 h-5 dark:brightness-200"
                     />
                  </div>
                  <div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Rental Period</p>
                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold mt-1">
                      {booking.pickupDate.split("T")[0]} to{" "}
                      {booking.returnDate.split("T")[0]}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mt-5">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 outline outline-1 outline-zinc-200 dark:outline-zinc-700/50">
                    <img
                      src={assets.location_icon_colored}
                      alt="location"
                      className="w-5 h-5 dark:brightness-200"
                    />
                  </div>
                  <div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Pick-up Location</p>
                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold mt-1">{booking.car.location}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="md:col-span-1 flex flex-col justify-end items-end gap-2 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-4 md:pt-0 pl-0 md:pl-6">
                <div className="text-sm text-right w-full">
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1">Total Price</p>
                  <h1 className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-500">{currency}{booking.price}</h1>
                  <p className="text-zinc-400 dark:text-zinc-500 mt-3 font-medium">Booked on <br/>{booking.createdAt.split("T")[0]}</p>
                </div>

                <div className="w-full flex justify-end mt-4">
                  <button
                    onClick={() => setActiveChat({ 
                      userId: booking.owner, 
                      carId: booking.car._id, 
                      carName: `${booking.car.brand} ${booking.car.model}` 
                    })}
                    className="flex items-center gap-2 px-6 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition shadow-lg"
                  >
                    💬 Chat with Owner
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {activeChat && (
            <ChatBox 
              receiverId={activeChat.userId} 
              carId={activeChat.carId} 
              carName={activeChat.carName} 
              onClose={() => setActiveChat(null)} 
            />
          )}
          
          {bookings.length === 0 && (
            <div className="text-center py-20">
               <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">No bookings found in your ledger.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
