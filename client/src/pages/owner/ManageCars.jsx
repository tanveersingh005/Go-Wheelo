import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const ManageCars = () => {
  const { ownerCars, ownerBookings, axios, token, fetchOwnerData, currency } = useAppContext();


  const handleDelete = async (carId) => {
    if (!confirm("Are you sure you want to permanently remove this car?")) return;
    try {
      const { data } = await axios.post("/api/owner/delete-car", { carId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success("Car removed from fleet");
        fetchOwnerData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Derive smart status for each car dynamically using live bookings
  const getCarStatus = (car) => {
    if (!car.isAvailable) return { label: "Inactive", style: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400", dot: "bg-zinc-400" };
    
    // Check if the car is currently checked out
    const today = new Date().toISOString().split("T")[0];
    const activeBooking = ownerBookings && ownerBookings.find(b => {
      const matchCarId = (b.car && b.car._id === car._id) || (b.car === car._id);
      if (!matchCarId || b.status !== "confirmed") return false;
      const p = b.pickupDate?.split("T")[0];
      const r = b.returnDate?.split("T")[0];
      return today >= p && today <= r;
    });

    if (activeBooking) {
      const until = new Date(activeBooking.returnDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { label: `In Use (till ${until})`, style: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30", dot: "bg-amber-500" };
    }
    return { label: "Available", style: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30", dot: "bg-emerald-500" };
  };

  return (
    <div className="px-5 py-8 md:px-10 md:py-10 pb-28 md:pb-12 min-h-full bg-zinc-50 dark:bg-zinc-950">
      
      {/* Page Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mb-2">Fleet Management</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
            Manage Cars
          </h1>
        </div>
        <span className="text-sm font-bold text-zinc-400 dark:text-zinc-600">{ownerCars.length} vehicle{ownerCars.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="grid grid-cols-12 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50">
          <p className="col-span-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Vehicle</p>
          <p className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hidden md:block">Category</p>
          <p className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Rate</p>
          <p className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Status</p>
          <p className="col-span-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 text-right">Actions</p>
        </div>

        {ownerCars.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-400 dark:text-zinc-600 font-medium">No vehicles in your fleet yet.</p>
          </div>
        ) : (
          ownerCars.map((car) => {
            const status = getCarStatus(car);
            return (
              <div
                key={car._id}
                className="grid grid-cols-12 items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* Vehicle */}
                <div className="col-span-5 flex items-center gap-4 min-w-0">
                  <img
                    src={car.image || assets.main_car}
                    alt={car.brand}
                    className="w-14 h-10 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                  />
                  <div className="min-w-0">
                    <p className="font-black tracking-tight text-zinc-900 dark:text-zinc-50 text-sm truncate">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
                      {car.year} · {car.seating_capacity} seats · {car.transmission.toLowerCase()}
                    </p>
                    {/* Mobile: show category inline */}
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 md:hidden">{car.category}</p>
                  </div>
                </div>

                {/* Category — hidden on mobile */}
                <p className="col-span-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hidden md:block">{car.category}</p>

                {/* Price */}
                <p className="col-span-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {currency}{car.pricePerDay}<span className="text-zinc-400 font-normal">/d</span>
                </p>

                {/* Smart Status Badge */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full ${status.style}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
                    <span className="hidden sm:inline">{status.label}</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(car._id)}
                    title="Remove car"
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-zinc-400 group-hover:text-red-500 transition">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageCars;
