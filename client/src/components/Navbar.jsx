/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 w-full
      ${location.pathname === "/" ? "glass-nav" : "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-light-border dark:border-dark-border"}`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.img 
             whileHover={{ scale: 1.05 }}
             src="/favicon.svg" alt="logo" className="h-9 w-9 dark:invert transition-all" 
          />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tracking-[-1px]">GoWheelo</h1>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
            {menuLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="relative text-sm font-bold tracking-wide text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase"
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="underline" 
                    className="absolute left-0 right-0 h-0.5 bg-blue-600 rounded bottom-[-6px]" 
                  />
                )}
              </Link>
            ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
           <button 
             onClick={toggleTheme} 
             className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shadow-inner"
             aria-label="Toggle Dark Mode"
           >
              {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
              )}
           </button>

           {/* Notification Bell — visible to logged-in users */}
           <NotificationBell />

           <div className="hidden sm:flex items-center gap-4">
              {!user ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogin(true)} 
                  className="bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-bold tracking-wider uppercase px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover-target"
                >
                  Sign In
                </motion.button>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)} 
                    className="flex items-center gap-2 p-1.5 pr-4 bg-zinc-100 dark:bg-zinc-800/80 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                  >
                     {user.image ? (
                        <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-sm bg-zinc-200 dark:bg-zinc-700" />
                     ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-sm flex justify-center items-center text-white font-bold text-sm uppercase">
                           {user.name ? user.name.charAt(0) : "U"}
                        </div>
                     )}
                     <span className="text-sm font-bold tracking-wide text-zinc-700 dark:text-zinc-300">{user.name || "User"}</span>
                  </button>
                  
                  <AnimatePresence>
                    {profileOpen && (
                       <motion.div 
                         initial={{ opacity: 0, y: 15, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                         className="absolute right-0 mt-4 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-50 text-left"
                       >
                          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                             <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">{user.name || "User"}</p>
                             <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{user.email || 'user@example.com'}</p>
                          </div>
                           
                          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                             {!isOwner ? (
                               <div 
                                 className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl mb-3 border border-blue-100 dark:border-blue-800/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-inner" 
                                 onClick={() => { navigate('/become-a-host'); setProfileOpen(false); }}
                               >
                                  <p className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Switch to Host</p>
                                  <p className="text-xs text-blue-600/70 dark:text-blue-400/80 mt-1 font-medium">List vehicles & manage rentals</p>
                               </div>
                             ) : (
                               <div 
                                 className="px-4 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform border border-zinc-200 dark:border-zinc-700 shadow-inner" 
                                 onClick={() => { navigate('/owner'); setProfileOpen(false); }}
                               >
                                  <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">Admin Dashboard</p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Manage your active fleet</p>
                               </div>
                             )}
                             <button 
                               onClick={() => { logout(); setProfileOpen(false); }} 
                               className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold uppercase tracking-wider transition"
                             >
                               Sign Out
                             </button>
                          </div>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
           </div>

           {/* Mobile menu button */}
           <button className="md:hidden p-2 text-zinc-600 dark:text-zinc-300" onClick={() => setOpen(!open)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 {open 
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                 }
              </svg>
           </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {open && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className="md:hidden bg-white dark:bg-zinc-950 border-b border-light-border dark:border-dark-border overflow-hidden"
           >
              <div className="flex flex-col px-6 py-4 space-y-4">
                 {menuLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition font-bold tracking-wide uppercase text-sm"
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </Link>
                 ))}
                 <div className="border-t border-light-border dark:border-dark-border my-2 pt-4 flex flex-col gap-4">
                    {user && (
                      <button 
                         className="text-left font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase text-sm"
                         onClick={() => { setOpen(false); isOwner ? navigate('/owner') : navigate('/become-a-host')}}
                      >
                         {isOwner ? "Switch to Admin Dashboard" : "Switch to Host Mode"}
                      </button>
                    )}
                    <button 
                       className="bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold uppercase tracking-wider text-sm shadow-md"
                       onClick={() => { setOpen(false); user ? logout() : setShowLogin(true) }}
                    >
                       {user ? "Sign Out" : "Sign In"}
                    </button>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
