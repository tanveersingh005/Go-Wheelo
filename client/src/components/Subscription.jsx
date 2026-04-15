import React from "react";
import Title from "./Title.jsx";

const Subscription = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Title
          title="Never Miss a Deal!"
          subTitle="Subscribe to get the latest updates on luxury car rentals and exclusive offers delivered straight to your inbox."
        />

        {/* Subscription Input - Ultra Premium */}
        <div className="mt-12 flex justify-center w-full max-w-2xl mx-auto relative group">
           {/* Subtle background ambient glow */}
           <div className="absolute inset-0 bg-zinc-200/50 dark:bg-zinc-800/20 rounded-full blur-xl pointer-events-none group-hover:bg-zinc-300/50 dark:group-hover:bg-zinc-700/30 transition-colors duration-700" />
           
           <div className="relative flex w-full bg-white/80 dark:bg-zinc-900/70 backdrop-blur-2xl border border-zinc-300/50 dark:border-zinc-800 rounded-full p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-all duration-300">
             
             {/* Input Icon Optional */}
             <div className="hidden sm:flex items-center pl-6 pr-2 text-zinc-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
             </div>

             <input
               type="email"
               placeholder="Enter your private email"
               className="flex-1 px-6 sm:px-2 py-4 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 font-medium text-lg w-full"
             />

             <button className="px-8 sm:px-10 py-4 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover-target shrink-0 tracking-widest uppercase text-xs sm:text-sm">
               Subscribe
             </button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
