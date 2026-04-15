import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";

const BecomeAHost = () => {
  const { user, setShowLogin, axios, setIsOwner } = useAppContext();
  const navigate = useNavigate();

  const handleRegisterAsOwner = async () => {
    if (!user) {
      toast.error("Please login first to become a host!");
      setShowLogin(true);
      return;
    }

    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        toast.success("Welcome aboard! You are now an official GoWheelo Host!");
        setIsOwner(true);
        navigate('/owner/add-car');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pb-20 transition-colors">
      {/* Hero Header */}
      <div className="bg-zinc-100/50 dark:bg-zinc-900/50 py-24 px-6 max-md:px-4 text-center border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Turn your car into an <span className="text-blue-600 dark:text-blue-500">earning engine</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto mt-6">
          Join thousands of hosts making a reliable secondary income with GoWheelo.
        </p>
        <button
          onClick={handleRegisterAsOwner}
          className="mt-10 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-10 py-4 rounded-xl text-sm font-black tracking-widest uppercase transition-all shadow-xl hover:-translate-y-1"
        >
          {user ? "Upgrade to Host Account" : "Login to Get Started"}
        </button>
      </div>

      {/* Perks Section */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-20 max-w-7xl mx-auto">
        <h2 className="text-2xl font-black uppercase tracking-widest mb-12 text-center text-zinc-400 dark:text-zinc-600">
          Why Host With Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:border-zinc-700 transition duration-300 group">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">$</span>
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">You're in Control</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm leading-relaxed">
              Set your own daily prices, adjust your calendar, and definitively choose who rents your vehicle.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:border-zinc-700 transition duration-300 group">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <img src={assets.users_icon} className="h-8 opacity-70 dark:invert" alt="support" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Complete Support</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm leading-relaxed">
              Our 24/7 dedicated support and built-in community ratings ensure you're protected every step of the journey.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none dark:hover:border-zinc-700 transition duration-300 group">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <img src={assets.car_icon} className="h-8 opacity-70 dark:invert" alt="fleet size" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Scale Your Fleet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm leading-relaxed">
              Whether you have one daily commuter or a fleet of fully dedicated sports cars, we accommodate you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAHost;
