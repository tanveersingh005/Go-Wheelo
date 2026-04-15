import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import ChatBox from "../components/ChatBox";
import PaymentModal from "../components/PaymentModal";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = React.useState(null);
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const today = new Date().toISOString().split("T")[0];
  const [pickupDate, setPickupDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");
  const [carBookings, setCarBookings] = React.useState([]);
  
  // Payment Gateway State
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentData, setPaymentData] = React.useState(null);
  const [showChat, setShowChat] = React.useState(false);

  const { cars, token, setShowLogin, axios, fetchOwnerData } = useAppContext();

  React.useEffect(() => {
    const selectedCar = cars.find((car) => car._id === id);
    setCar(selectedCar);
  }, [id, cars]);

  // Fetch all confirmed bookings for this car to know blocked date ranges
  React.useEffect(() => {
    if (car && axios) {
      axios.post("/api/bookings/car", { carId: car._id })
        .then(res => {
          if (res.data.success) {
            setCarBookings(res.data.bookings || []);
          }
        })
        .catch(err => console.error(err));
    }
  }, [car, axios]);

  // All confirmed bookings = blocked date ranges
  const confirmedBookings = carBookings.filter(b => b.status === "confirmed");

  // Check if a proposed range overlaps any confirmed booking
  const hasDateConflict = (pickup, ret) => {
    if (!pickup || !ret) return false;
    const p = new Date(pickup);
    const r = new Date(ret);
    return confirmedBookings.some(b => {
      const bPickup = new Date(b.pickupDate);
      const bReturn = new Date(b.returnDate);
      // Overlap condition: ranges overlap if p < bReturn AND r > bPickup
      return p < bReturn && r > bPickup;
    });
  };

  // Compute the earliest blocked date on or after a given start date
  const getConflictInfo = (pickup, ret) => {
    if (!pickup || !ret) return null;
    const p = new Date(pickup);
    const r = new Date(ret);
    const conflict = confirmedBookings.find(b => {
      const bPickup = new Date(b.pickupDate);
      const bReturn = new Date(b.returnDate);
      return p < bReturn && r > bPickup;
    });
    if (!conflict) return null;
    return {
      from: new Date(conflict.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      to: new Date(conflict.returnDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  };

  const dateConflict = getConflictInfo(pickupDate, returnDate);

  // Calculate rental duration
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const p = new Date(pickupDate);
    const r = new Date(returnDate);
    if (r <= p) return 0;
    const diffTime = Math.abs(r - p);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const totalDays = calculateDays();
  const totalPrice = car ? car.pricePerDay * totalDays : 0;
  const rupeePrice = totalPrice * 83; // Fake conversion rate

  const handleRequestBooking = (e) => {
    e.preventDefault();
    if (!token) { setShowLogin(true); return; }
    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates");
      return;
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error("Return date must be after pickup date");
      return;
    }
    if (dateConflict) {
      toast.error(`Those dates conflict with an existing booking (${dateConflict.from} – ${dateConflict.to})`);
      return;
    }
    if (totalDays === 0) {
      toast.error("Please select a valid date range");
      return;
    }
    setPaymentData(null);
    setShowPaymentModal(true);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const finalizeBooking = async (payInfo) => {
    try {
      const { data } = await axios.post("/api/bookings/create", { 
        carId: car._id, 
        pickupDate, 
        returnDate,
        ...payInfo 
      });
      if (data.success) {
        setPaymentData(payInfo);
        if (fetchOwnerData) fetchOwnerData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    if (bookingConfirmed) navigate("/my-bookings");
  };

  if (!car) return <Loader />;

  // Determine current availability for top status banner
  const currentBlockingBooking = confirmedBookings.find(b => {
    const pick = new Date(b.pickupDate);
    const ret = new Date(b.returnDate);
    const now = new Date();
    return now >= pick && now <= ret;
  });

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 pb-20">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer text-zinc-400 dark:text-zinc-600 mb-8 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
      >
        <img src={assets.arrow_icon} alt="back" className="rotate-180 opacity-65 dark:invert" />
        <span className="text-sm font-medium">Back to all cars</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: Image & Details */}
        <div className="lg:col-span-2">
          <img src={car.image} alt={car.brand} className="rounded-2xl w-full h-96 object-cover shadow-sm border border-zinc-200 dark:border-zinc-800" />

          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mt-6">{car.brand} {car.model}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{car.year} · {car.category} · {car.location}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { icon: assets.users_icon, label: `${car.seating_capacity} Seats` },
              { icon: assets.fuel_icon, label: car.fuel_type },
              { icon: assets.car_icon, label: car.transmission },
              { icon: assets.location_icon, label: car.location },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <img src={s.icon} className="h-5 opacity-70 dark:invert" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-base font-black tracking-tight text-zinc-900 dark:text-white uppercase tracking-widest text-xs mb-3">Description</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              {car.description || "This premium vehicle offers a smooth driving experience, top-class comfort, and advanced safety features — perfect for both city and highway drives."}
            </p>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">Included Features</h3>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-6 text-sm text-zinc-600 dark:text-zinc-400">
              {["Air Conditioning", "Bluetooth", "Backup Camera", "Cruise Control", "Keyless Entry", "Heated Seats", "Sunroof", "Navigation"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <img src={assets.check_icon} className="h-4 dark:invert" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Booked Dates Panel — shows all confirmed blocked periods */}
          {confirmedBookings.length > 0 && (
            <div className="mt-8 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">Unavailable Dates</p>
              <div className="flex flex-wrap gap-2">
                {confirmedBookings.map((b, i) => (
                  <span key={i} className="text-xs font-bold px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-800/30">
                    {new Date(b.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(b.returnDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-3 font-medium">Car is unavailable for these confirmed booking periods.</p>
            </div>
          )}
        </div>

        {/* RIGHT: Booking Card */}
        <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-6 h-fit border border-zinc-200 dark:border-zinc-800 sticky top-24">
          <p className="text-3xl font-black text-zinc-900 dark:text-white">
            {currency}{car.pricePerDay}
            <span className="text-base font-medium text-zinc-400 dark:text-zinc-500"> / day</span>
          </p>

          {/* Current status banner */}
          {currentBlockingBooking ? (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl flex items-start gap-3">
              <img src={assets.cautionIconColored} className="w-5 h-5 mt-0.5 opacity-80 shrink-0" alt="booked" />
              <div>
                <p className="text-amber-800 dark:text-amber-400 text-sm font-black">Currently Booked</p>
                <p className="text-amber-700 dark:text-amber-500 text-xs mt-0.5 font-medium">
                  Free after {new Date(currentBlockingBooking.returnDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <p className="text-emerald-800 dark:text-emerald-400 text-sm font-bold">Ready for Booking</p>
            </div>
          )}

          {/* Date Conflict Warning — live as user selects dates */}
          {dateConflict && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-start gap-3">
              <span className="text-red-500 text-base shrink-0">⛔</span>
              <div>
                <p className="text-red-700 dark:text-red-400 text-sm font-black">Date Conflict</p>
                <p className="text-red-600 dark:text-red-500 text-xs mt-0.5 font-medium">
                  Already booked {dateConflict.from} – {dateConflict.to}. Choose different dates.
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                min={today}
                onChange={(e) => { setPickupDate(e.target.value); setReturnDate(""); }}
                className="w-full mt-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 dark:[color-scheme:dark]"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Return Date</label>
              <input
                type="date"
                value={returnDate}
                min={pickupDate || today}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full mt-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 dark:[color-scheme:dark]"
              />
            </div>

            <button
              className={`w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                dateConflict
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                  : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 shadow-sm"
              }`}
              onClick={handleRequestBooking}
              disabled={!!dateConflict}
            >
              {dateConflict ? "Select Valid Dates" : "Request Booking"}
            </button>

            <button
              onClick={() => setShowChat(true)}
              className="w-full py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              💬 Chat with Host
            </button>

            <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 font-medium">
              Booking is confirmed after host approval
            </p>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => {
            setShowPaymentModal(false);
            if (paymentData) navigate("/my-bookings");
        }}
        onConfirm={finalizeBooking}
        car={car}
        totalDays={totalDays}
        totalPrice={totalPrice}
        currencySymbol={currency}
      />

      {showChat && car && (
        <ChatBox 
          receiverId={car.owner} 
          carId={car._id} 
          carName={`${car.brand} ${car.model}`} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
};

export default CarDetails;

