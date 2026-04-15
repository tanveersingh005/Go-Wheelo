import React, { useState } from "react";
import { assets, cityList } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";

const Hero = () => {
  const [PickupLocation, setPickupLocation] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const { pickUpDate: pickupDate, returnDate, setPickupDate, setReturnDate } = useAppContext();
  const navigate = useNavigate();

  const handleSearch = (e) => {
     e.preventDefault();
     navigate('/cars?pickupLocation=' + PickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-14 bg-light-bg dark:bg-dark-bg text-center pt-8 pb-12 overflow-hidden relative">
      
      {/* Dynamic particles using user provided code */}
      <ParticleBackground overlayClass="absolute inset-0" />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0 hidden dark:block" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0 hidden dark:block" />
      
      <motion.div
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut" }}
         className="z-10 mt-8"
      >
        <span className="px-5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300 font-semibold tracking-[0.2em] text-[10px] uppercase mb-6 inline-block shadow-sm">
          Premium Vehicle Rentals
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Experience Ultimate <br/><span className="text-zinc-900 dark:text-zinc-100 font-serif italic font-light">Mobility.</span>
        </h1>
        <p className="mt-6 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed font-light">
          The next generation of vehicle rental. Discover a seamless booking ecosystem built for luxury, performance, and complete command over your journey.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        onSubmit={handleSearch}
        className="z-10 flex flex-col md:flex-row items-center justify-between p-3 md:rounded-full w-full max-w-sm md:max-w-4xl mx-4 glass-panel border border-zinc-200/50 dark:border-zinc-800/80 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row w-full items-center gap-4 md:gap-8 min-md:ml-6 md:px-6 py-4 md:py-0 relative z-10">
          <div className="flex flex-col items-start gap-1 w-full md:w-auto">
            <select
              required
              value={PickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="bg-transparent text-zinc-900 dark:text-zinc-100 font-medium outline-none cursor-pointer w-full text-lg hover-target"
            >
              <option value="" className="text-zinc-500 dark:text-zinc-400">Location</option>
              {cityList.map((city) => (
                <option key={city} value={city} className="text-zinc-900">{city}</option>
              ))}
            </select>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
              {PickupLocation ? "Location selected" : "Pick-up Point"}
            </p>
          </div>

          <div className="hidden md:block w-px h-10 bg-zinc-200 dark:bg-zinc-800" />

          <div className="flex flex-col items-start gap-1 w-full md:w-auto">
            <label htmlFor="pickup-date" className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Pick-up Date</label>
            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              min={today}
              className="mt-1 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none font-medium text-lg w-full cursor-pointer dark:[color-scheme:dark] hover-target"
              style={{ padding: 0 }}
              required
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-zinc-200 dark:bg-zinc-800" />

          <div className="flex flex-col items-start gap-1 w-full md:w-auto">
            <label htmlFor="return-date" className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Return Date</label>
            <input
            value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              min={pickupDate || today}
              className="mt-1 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none font-medium text-lg w-full cursor-pointer dark:[color-scheme:dark] hover-target"
              style={{ padding: 0 }}
              required
            />
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 flex items-center justify-center gap-3 px-10 py-4 w-full md:w-auto mt-4 md:mt-0 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 rounded-full cursor-pointer shadow-xl transition-all font-medium text-lg hover:-translate-y-1 hover-target"
        >
          Explore
          <img
            src={assets.arrow_right_icon || assets.search_icon}
            alt="search"
            className="w-4 h-4 filter brightness-0 invert opacity-90 dark:invert-0"
          />
        </motion.button>
      </motion.form>

      <motion.div
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
         className="z-10 mt-8 w-full max-w-5xl px-6 flex justify-center"
      >
        <img 
          src={assets.main_car} 
          alt="Luxury Car Showcase" 
          className="w-full max-w-3xl object-contain drop-shadow-2xl" 
          fetchPriority="high"
          loading="eager"
        />
      </motion.div>
    </div>
  );
};

export default Hero;
