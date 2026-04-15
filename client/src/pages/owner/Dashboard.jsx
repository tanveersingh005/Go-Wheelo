import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { ownerCars, ownerBookings } = useAppContext();

  const totalCars = ownerCars.length;
  const availableCars = ownerCars.filter(car => car.isAvailable || car.isAvaliable).length;
  const totalBookings = ownerBookings.length;
  const pendingBookings = ownerBookings.filter(b => b.status === "pending").length;
  const completedBookings = ownerBookings.filter(b => b.status === "completed").length;

  const monthlyRevenue = ownerBookings
    .filter(b => b.status === "completed" || b.status === "confirmed")
    .reduce((acc, curr) => acc + curr.price, 0);

  const recentBookings = [...ownerBookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(item => ({
      car: item.car,
      date: item.createdAt.split("T")[0],
      price: item.price,
      status: item.status
    }));

  const currency = import.meta.env.VITE_CURRENCY || "$";

  const statusStyle = (status) => {
    switch (status) {
      case "completed": return "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800";
      case "pending":   return "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800";
      default:          return "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800";
    }
  };

  const stats = [
    { label: "Fleet",     value: totalCars        },
    { label: "Bookings",  value: totalBookings     },
    { label: "Pending",   value: pendingBookings   },
    { label: "Done",      value: completedBookings },
  ];

  return (
    <div className="px-6 md:px-10 py-10 pb-28 md:pb-12 min-h-full bg-zinc-50 dark:bg-zinc-950">

      {/* Page Header */}
      <div className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mb-2">Owner Portal</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Dashboard
        </h1>
      </div>

      {/* Unified Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-200 dark:divide-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-8 shadow-sm">
        {stats.map((s, i) => (
          <div key={i} className="px-6 py-6 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">{s.label}</span>
            <span className="text-5xl font-black text-zinc-900 dark:text-white leading-none">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Bookings — 2/3 width */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">

          <div className="px-8 pt-7 pb-4 flex items-end justify-between border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-1">Activity</p>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Recent Bookings</h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-full">
              Latest {recentBookings.length}
            </span>
          </div>

          {recentBookings.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <p className="text-zinc-400 dark:text-zinc-600 text-sm font-medium">Your fleet is ready. No bookings yet.</p>
            </div>
          ) : (
            <div>
              {recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5 font-medium">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-3 shrink-0">
                    <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">{currency}{booking.price}</span>
                    <span className={`hidden sm:inline px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Panel — 1/3 width */}
        <div className="flex flex-col gap-4">

          {/* Revenue */}
          <div className="bg-zinc-950 dark:bg-zinc-900 rounded-2xl border border-zinc-800 p-8 flex-1 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6">Revenue · {new Date().toLocaleString('default', { month: 'long' })}</p>
            <p className="text-5xl font-black text-white leading-none">
              {currency}{monthlyRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-600 mt-3 font-medium leading-relaxed">
              From completed & confirmed bookings
            </p>
          </div>

          {/* Fleet Summary */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-4">Fleet Summary</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Total Vehicles</span>
                <span className="font-black text-zinc-900 dark:text-white">{totalCars}</span>
              </div>
              <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Available Now</span>
                <span className="font-black text-zinc-900 dark:text-white">{availableCars}</span>
              </div>
              <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Occupancy Rate</span>
                <span className="font-black text-zinc-900 dark:text-white">
                  {totalCars > 0 ? Math.round(((totalCars - availableCars) / totalCars) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
