import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";

const PaymentModal = ({ isOpen, onClose, onConfirm, car, totalDays, totalPrice, currencySymbol }) => {
  const [payStep, setPayStep] = useState(1); // 1: Summary, 2: Payment, 3: Processing, 4: Success
  const [payInRupees, setPayInRupees] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [timer, setTimer] = useState(300); // 5 minutes
  
  const rupeeRate = 83.5;
  const displayPrice = payInRupees ? (totalPrice * rupeeRate).toFixed(0) : totalPrice;
  const currentCurrency = payInRupees ? "INR" : "USD";
  const currentSymbol = payInRupees ? "₹" : "$";

  useEffect(() => {
    let interval;
    if (isOpen && payStep === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, payStep, timer]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePayment = async () => {
    setPayStep(3);
    // Simulate network delay
    setTimeout(() => {
        const transactionId = "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase();
        onConfirm({
            paymentStatus: "paid",
            paymentMethod,
            transactionId,
            currency: currentCurrency,
            amount: displayPrice
        });
        setPayStep(4);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={payStep !== 3 ? onClose : undefined}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-[480px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              {payStep === 1 ? "Checkout — Step 1" : payStep === 2 ? "Checkout — Step 2" : payStep === 3 ? "Verifying" : "Success"}
            </span>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
              {payStep === 1 ? "Order Summary" : payStep === 2 ? "Select Payment" : payStep === 3 ? "Authenticating..." : "Payment Confirmed"}
            </h2>
          </div>
          {payStep !== 3 && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: SUMMARY */}
            {payStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-6">
                  <img src={car.image} className="w-24 h-16 object-cover rounded-xl border border-zinc-200 dark:border-zinc-800" />
                  <div>
                    <p className="font-black text-zinc-900 dark:text-white">{car.brand} {car.model}</p>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">{totalDays} Days Rental</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex justify-between text-sm">
                      <span className="text-zinc-500 font-medium">Base Fare</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{currentSymbol}{displayPrice}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-zinc-500 font-medium">Insurance & Fees</span>
                      <span className="font-bold text-emerald-600">Included</span>
                   </div>
                   <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
                   <div className="flex justify-between items-baseline">
                      <span className="font-black text-xs uppercase tracking-widest text-zinc-400">Total Amount</span>
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-500">{currentSymbol}{Number(displayPrice).toLocaleString()}</span>
                   </div>
                </div>

                {/* Currency Toggle */}
                <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-2xl mb-8 border border-zinc-200/50 dark:border-zinc-800">
                    <button 
                        onClick={() => setPayInRupees(false)}
                        className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${!payInRupees ? "bg-white dark:bg-zinc-800 shadow-md text-zinc-900 dark:text-white" : "text-zinc-400"}`}
                    >
                        USD ($)
                    </button>
                    <button 
                        onClick={() => setPayInRupees(true)}
                        className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${payInRupees ? "bg-white dark:bg-zinc-800 shadow-md text-zinc-900 dark:text-white" : "text-zinc-400"}`}
                    >
                        INR (₹)
                    </button>
                </div>

                <button 
                    onClick={() => setPayStep(2)}
                    className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition shadow-xl"
                >
                    Choose Payment Method →
                </button>
              </motion.div>
            )}

            {/* STEP 2: PAYMENT METHOD */}
            {payStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Method Selector */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { id: 'qr', label: 'Scan QR', icon: '📷' },
                        { id: 'upi', label: 'UPI ID', icon: '📱' },
                        { id: 'card', label: 'Card', icon: '💳' }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id)}
                            className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${paymentMethod === m.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-zinc-100 dark:border-zinc-800 text-zinc-400"}`}
                        >
                            <span className="text-2xl">{m.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{m.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content based on method */}
                <div className="mb-8">
                    {paymentMethod === 'qr' && (
                        <div className="flex flex-col items-center p-6 bg-zinc-50 dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
                             <div className="bg-white p-4 rounded-3xl shadow-sm mb-4">
                                <QRCodeSVG 
                                    value={`upi://pay?pa=gowheelo@okaxis&pn=GoWheelo&am=${displayPrice}&cu=${currentCurrency}&tn=Rental_${car._id}`} 
                                    size={160}
                                    level="H"
                                    includeMargin={false}
                                />
                             </div>
                             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">UPI ID</p>
                             <p className="text-sm font-black text-zinc-900 dark:text-white">gowheelo@okaxis</p>
                             
                             <div className="mt-6 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                Expires in {formatTime(timer)}
                             </div>
                        </div>
                    )}

                    {paymentMethod === 'upi' && (
                        <div className="space-y-4">
                            <div className="p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Enter UPI ID</label>
                                <input placeholder="username@upi" className="w-full bg-transparent text-lg font-black mt-1 outline-none text-zinc-900 dark:text-white" />
                            </div>
                            <p className="text-xs text-center text-zinc-400 font-medium">A notification will be sent to your UPI app</p>
                        </div>
                    )}

                    {paymentMethod === 'card' && (
                        <div className="space-y-3">
                             <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Card Number</label>
                                <input placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-transparent font-bold mt-1 outline-none text-zinc-900 dark:text-white" />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expiry</label>
                                    <input placeholder="MM/YY" className="w-full bg-transparent font-bold mt-1 outline-none text-zinc-900 dark:text-white" />
                                </div>
                                <div className="flex-1 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CVV</label>
                                    <input placeholder="***" type="password" maxLength="3" className="w-full bg-transparent font-bold mt-1 outline-none text-zinc-900 dark:text-white" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setPayStep(1)}
                        className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl text-xs font-black uppercase tracking-widest transition"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handlePayment}
                        className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                    >
                        Verify & Pay {currentSymbol}{Number(displayPrice).toLocaleString()}
                    </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PROCESSING */}
            {payStep === 3 && (
                <motion.div
                    key="step3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 flex flex-col items-center text-center"
                >
                    <div className="relative w-20 h-20 mb-8">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-600 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                            🛡️
                        </div>
                    </div>
                    <p className="text-zinc-500 font-medium">Securely verifying your transaction with GoWheelo Bank...</p>
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] mt-4">DO NOT REFRESH</p>
                </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {payStep === 4 && (
                <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                >
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                        <motion.span 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            ✓
                        </motion.span>
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Order Confirmed!</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-8 px-4">Your payment of {currentSymbol}{displayPrice} was successful. Redirecting you to your bookings...</p>
                    
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl text-sm font-black uppercase tracking-widest transition shadow-xl"
                    >
                        View Order Details
                    </button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
