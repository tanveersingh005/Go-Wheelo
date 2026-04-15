/* eslint-disable no-unused-vars */
import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cards = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:border-zinc-700 overflow-hidden transition-all duration-300 cursor-pointer" 
      onClick={() => {navigate(`/car-details/${car._id}`); window.scrollTo(0,0)}}
    >
      
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          src={car.image}
          alt={car.brand}
          className="w-full h-full object-cover"
        />

        {/* Active Fleet Tag */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700">
            Available To Rent
          </span>
        </div>

        <div className="absolute bottom-4 right-4">
           <span className="bg-black/70 backdrop-blur-md text-white font-medium px-4 py-1.5 rounded-lg text-sm border border-white/10 shadow-lg">
             {currency}{car.pricePerDay}<span className="text-zinc-300 font-normal">/day</span>
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
          {car.category} · {car.year}
        </p>

        <div className="grid grid-cols-2 gap-y-3 mt-6 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50">
              <img src={assets.users_icon} className="h-4 opacity-70 dark:invert" alt="seats" />
            </div>
            <span className="font-medium">{car.seating_capacity} Seats</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50">
              <img src={assets.fuel_icon} className="h-4 opacity-70 dark:invert" alt="fuel" />
            </div>
            <span className="font-medium">{car.fuel_type}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50">
              <img src={assets.car_icon} className="h-4 opacity-70 dark:invert" alt="transmission" />
            </div>
            <span className="font-medium">{car.transmission}</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50 flex-shrink-0">
              <img src={assets.location_icon} className="h-4 opacity-70 dark:invert" alt="location" />
            </div>
            <span className="font-medium truncate">{car.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cards;
