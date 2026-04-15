import React from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import ChatBox from "../../components/ChatBox";

const ManageBookings = () => {
  const { ownerBookings: bookings, axios, token, fetchOwnerData, currency } = useAppContext();
  const [activeChat, setActiveChat] = React.useState(null); // { userId, carId, carName }

  const handleStatusChange = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/update-status", { bookingId, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "confirmed":  return "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900";
      case "completed":  return "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400";
      case "cancelled":  return "bg-red-50 dark:bg-red-900/20 text-red-500";
      case "pending":    return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      default:           return "bg-zinc-100 text-zinc-500";
    }
  };

  const pending   = bookings.filter(b => b.status === "pending");
  const active    = bookings.filter(b => b.status === "confirmed");
  const archived  = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  const BookingRow = ({ booking, showActions }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors gap-4">
      
      {/* Car Info */}
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={booking.car.image}
          alt={booking.car.brand}
          className="w-14 h-10 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
        />
        <div className="min-w-0">
          <p className="font-black text-sm tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
            {booking.car.brand} {booking.car.model}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
            {booking.pickupDate?.split("T")[0]} → {booking.returnDate?.split("T")[0]}
          </p>
          {booking.user && (
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
              by <span className="font-bold">{booking.user.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Price + Status + Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">{currency}{booking.price}</span>

        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle(booking.status)}`}>
          {booking.status}
        </span>

        {showActions && (
          <div className="flex items-center gap-2 ml-1">
            {booking.status === "pending" && (
              <>
                <button
                  onClick={() => handleStatusChange(booking._id, "confirmed")}
                  className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-black rounded-full uppercase tracking-widest hover:opacity-80 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusChange(booking._id, "cancelled")}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-black rounded-full uppercase tracking-widest hover:opacity-80 transition border border-red-100 dark:border-red-800/30"
                >
                  Reject
                </button>
              </>
            )}
            {booking.status === "confirmed" && (
              <>
                <button
                  onClick={() => handleStatusChange(booking._id, "completed")}
                  className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/30 text-xs font-black rounded-full uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                >
                  Mark Returned
                </button>
                <button
                  onClick={() => handleStatusChange(booking._id, "cancelled")}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-xs font-black rounded-full uppercase tracking-widest hover:opacity-80 transition"
                  title="Cancel booking before pickup"
                >
                  Cancel
                </button>
              </>
            )}
            
            {/* Chat Action */}
            <button
              onClick={() => setActiveChat({ 
                userId: booking.user._id, 
                carId: booking.car._id, 
                carName: `${booking.car.brand} ${booking.car.model}` 
              })}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shadow-inner"
              title="Chat with Customer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.303.025-.607.047-.912.067a4.567 4.567 0 01-3.123-1.291l-1.946-1.682a.75.75 0 00-.466-.157H7.5A2.25 2.25 0 015.25 11.25V5.25A2.25 2.25 0 017.5 3h10.125c.621 0 1.125.504 1.125 1.125v4.386z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0V10.5a.75.75 0 01.75-.75zM12 9.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0V10.5a.75.75 0 01.75-.75zM9 9.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0V10.5a.75.75 0 01.75-.75z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const Section = ({ title, subtitle, items, showActions }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">{title}</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5 font-medium">{subtitle}</p>
        </div>
        <span className="text-xs font-black text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-center text-zinc-400 dark:text-zinc-600 py-10 text-sm font-medium">No bookings here.</p>
      ) : (
        items.map(b => <BookingRow key={b._id} booking={b} showActions={showActions} />)
      )}
    </div>
  );

  return (
    <div className="px-5 py-8 md:px-10 md:py-10 pb-28 md:pb-12 min-h-full bg-zinc-50 dark:bg-zinc-950">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 mb-2">Fleet Management</p>
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Manage Bookings
        </h1>
        <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-600 font-medium">
          Confirming a booking locks the car until the return date. Rejecting releases it immediately.
        </p>
      </div>

      {/* Pending — requires admin action */}
      <Section
        title="Awaiting Your Decision"
        subtitle="These bookings are pending. Confirm them to lock the car, or reject to release it."
        items={pending}
        showActions={true}
      />

      {/* Active — confirmed */}
      <Section
        title="Active Confirmed Bookings"
        subtitle="These are confirmed. The car is tagged as booked until the return date."
        items={active}
        showActions={true}
      />

      {/* Archived */}
      <Section
        title="Completed & Cancelled"
        subtitle="Historical records only. Revenue is counted from completed bookings."
        items={archived}
        showActions={false}
      />

      {activeChat && (
        <ChatBox 
          receiverId={activeChat.userId} 
          carId={activeChat.carId} 
          carName={activeChat.carName} 
          onClose={() => setActiveChat(null)} 
        />
      )}
    </div>
  );
};

export default ManageBookings;
