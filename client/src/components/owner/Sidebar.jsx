import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { user, axios, fetchUser, token } = useAppContext();
  const [image, setImage] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const { data } = await axios.post("/api/owner/update-image", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        setImage("");
        fetchUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (image) updateImage();
  }, [image]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300 shrink-0 ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="self-end m-3 p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 4.5l-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
            }
          </svg>
        </button>

        {/* Profile */}
        {!collapsed && (
          <div className="flex flex-col items-center px-5 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <label htmlFor="profile-image" className="relative group cursor-pointer">
              {user?.image ? (
                <img
                  src={image ? URL.createObjectURL(image) : user.image}
                  className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-zinc-950 transition-all"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg flex items-center justify-center text-white font-bold text-xl uppercase">
                  {user?.name ? user.name.charAt(0) : "U"}
                </div>
              )}
              <div className="absolute inset-0 hidden group-hover:flex bg-black/50 rounded-full items-center justify-center backdrop-blur-[2px] transition-all">
                <img src={assets.edit_icon} className="h-5 w-5 invert" />
              </div>
            </label>
            <input type="file" id="profile-image" hidden onChange={(e) => setImage(e.target.files[0])} />
            <p className="mt-3 font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-sm text-center leading-snug">{user?.name}</p>
            <span className="mt-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              Owner
            </span>
          </div>
        )}

        {/* Collapsed Avatar */}
        {collapsed && (
          <div className="flex justify-center mb-4 mx-auto">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm uppercase">
              {user?.name?.charAt(0) || "O"}
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          {ownerMenuLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              end
              title={collapsed ? link.name : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                 ${isActive
                  ? "bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg font-bold"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? link.coloredIcon : link.icon}
                    className={`w-5 h-5 shrink-0 transition-all ${isActive ? "brightness-0 invert dark:brightness-0 dark:invert-0" : "opacity-60 dark:invert"}`}
                  />
                  {!collapsed && <span className="text-sm truncate">{link.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center px-2 py-2 shadow-[0_-4px_30px_rgba(0,0,0,0.08)]">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
               ${isActive
                ? "text-zinc-950 dark:text-white"
                : "text-zinc-400 dark:text-zinc-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? link.coloredIcon : link.icon}
                  className={`w-5 h-5 ${isActive ? "dark:invert" : "opacity-50 dark:invert"}`}
                />
                <span className="text-[9px] font-bold uppercase tracking-wider">{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
