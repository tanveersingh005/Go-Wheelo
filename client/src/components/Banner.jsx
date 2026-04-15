import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-0 mb-28 px-2 py-0">
      {/* Centered container */}
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] px-10 py-16 md:px-20 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 mt-0 bg-zinc-950 border border-zinc-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden group">
          
          {/* Subtle background glow effect */}
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-zinc-800/30 rounded-full blur-[120px] pointer-events-none group-hover:bg-zinc-700/40 transition-colors duration-1000 ease-out" />

          {/* Left Content */}
          <div className="relative z-10 text-white max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white mb-2">
              Do You Own a <br />
              <span className="font-serif italic font-light text-zinc-400">Luxury Car?</span>
            </h2>

            <p className="mt-6 text-zinc-400 leading-relaxed font-light text-lg pr-4">
              Monetize your vehicle effortlessly by listing it on our premier platform.
              We handle the comprehensive insurance, rigorous driver verification, and secure payments —
              so you can earn passive income, stress-free.
            </p>

            <button
              onClick={() => navigate("/owner")}
              className="mt-10 bg-white text-zinc-950 font-bold px-10 py-4 rounded-full hover:bg-zinc-200 transition shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover-target uppercase tracking-widest text-sm flex items-center gap-3"
            >
              List Your Vehicle 
              <span className="text-lg">→</span>
            </button>
          </div>

          {/* Right Image */}
          <div className="relative z-10 w-full md:w-[500px] flex justify-end transform transition-transform duration-1000 ease-out group-hover:scale-[1.03] group-hover:-translate-x-4">
            <img
              src={assets.banner_car_image}
              alt="Luxury Car"
              className="w-full max-w-lg drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] filter contrast-125"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
