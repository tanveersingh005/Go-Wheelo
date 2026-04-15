/* eslint-disable no-unused-vars */
import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationBell from "../NotificationBell";

const NavbarOwner = () => {
  const user = useAppContext().user;
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='flex items-center justify-between px-4 sm:px-10 py-5 border-b border-light-border dark:border-dark-border bg-white dark:bg-dark-bg z-50'>
      <Link to="/" className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
        <img src="/favicon.svg" alt="logo" className="h-7 dark:invert transition-all" />
        <span className="hidden sm:block tracking-tight">GoWheelo</span>
      </Link>
      
      <div className="flex items-center gap-4 sm:gap-6">
          <button 
             onClick={toggleTheme} 
             className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shadow-inner"
             aria-label="Toggle Dark Mode"
           >
              {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
              )}
           </button>
           
           {/* Notification Bell */}
           <NotificationBell />

           {/* Explicit toggle back to User mode for host */}
           <Link to="/" className="hidden md:flex px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-full font-bold uppercase tracking-widest text-xs transition border border-zinc-200 dark:border-zinc-700">
              Return to Fleet
           </Link>
           
          <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-zinc-200 dark:border-zinc-800">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-sm flex justify-center items-center text-white font-bold text-base uppercase">
                {user?.name ? user.name.charAt(0) : "O"}
             </div>
             <p className="text-zinc-800 dark:text-zinc-200 font-bold tracking-wide hidden sm:block"> {user?.name || "Admin"} </p>
          </div>
      </div>
    </div>
  );
};

export default NavbarOwner;
