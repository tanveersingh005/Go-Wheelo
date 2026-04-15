import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="/favicon.svg" alt="logo" className="h-8 shadow-sm rounded-md dark:invert transition-all" />
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tracking-[-1px]">GoWheelo</span>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">
              Premium car rental service with a wide selection of luxury and
              everyday vehicles for all your driving needs.
            </p>

            <div className="flex gap-4 mt-8 opacity-70">
                <a href="#" className="hover:opacity-100 transition"><img src={assets.facebook_logo} alt="facebook" className="dark:invert w-5" /></a>
                <a href="#" className="hover:opacity-100 transition"><img src={assets.twitter_logo} alt="twitter" className="dark:invert w-5" /></a>
                <a href="#" className="hover:opacity-100 transition"><img src={assets.instagram_logo} alt="instagram" className="dark:invert w-5" /></a>
                <a href="#" className="hover:opacity-100 transition"><img src={assets.gmail_logo} alt="mail" className="dark:invert w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white uppercase tracking-widest text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home Portfolio</Link></li>
              <li><Link to="/cars" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Browse Fleet</Link></li>
              <li><Link to="/become-a-host" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Host Program</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white uppercase tracking-widest text-xs mb-8">Legal & Info</h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Concierge Support</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Framework</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white uppercase tracking-widest text-xs mb-8">Contact HQ</h4>
            <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              <li className="flex items-center gap-3">
                 <span className="opacity-60">📍</span> 1234 Luxury Drive, Bangalore
              </li>
              <li className="flex items-center gap-3">
                 <span className="opacity-60">📞</span> +91 67453 89923
              </li>
              <li className="flex items-center gap-3">
                 <span className="opacity-60">✉️</span> support@gowheelo.com
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-16 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          <p>© 2026 GoWheelo. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Terms</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Privacy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
