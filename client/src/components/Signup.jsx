import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { setShowSignup, setShowLogin, axios, setToken } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("boy");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [isSending, setIsSending] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setIsSending(true);
    try {
      const { data } = await axios.post("/api/user/send-otp", { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSending(false);
    }
  };

  const onRegisterHandler = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const { data } = await axios.post("/api/user/register", { name, email, password, gender, otp });
      if (data.success) {
        toast.success("Signup successful");
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowSignup(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowSignup(false)}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {step === 1 ? "Sign Up" : "Verify Email"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {step === 1 ? "Create your account to continue" : `Enter the code sent to ${email}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="mt-8">
            {/* Name */}
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM1.5 14s1-3.5 6.5-3.5 6.5 3.5 6.5 3.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="text"
                placeholder="Full Name"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
              </svg>
              <input
                type="email"
                placeholder="Email id"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
              </svg>
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 1C8.015 1 6 3.015 6 5.5c0 .93.25 1.8.69 2.55L1.5 13.25a1 1 0 000 1.414l.836.836a1 1 0 001.414 0L9 10.31c.75.44 1.62.69 2.5.69C13.985 11 16 8.985 16 6.5S13.985 1 10.5 1zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#6B7280"/>
              </svg>
              <input
                type="password"
                placeholder="Confirm Password"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Gender Selection */}
            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 pr-4">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM1.5 14s1-3.5 6.5-3.5 6.5 3.5 6.5 3.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <select 
                className="bg-transparent text-gray-500 outline-none text-sm w-full h-full cursor-pointer appearance-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="boy">Male</option>
                <option value="girl">Female</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="mt-6 w-full h-11 rounded-full text-white bg-primary-dull hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSending ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={onRegisterHandler} className="mt-8">
            <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full tracking-[1em] font-bold"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full h-11 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg"
            >
              Verify & Register
            </button>

            <button 
              type="button"
              onClick={handleSendOTP}
              className="mt-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition"
            >
              Resend Code
            </button>
            
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="block mx-auto mt-2 text-[10px] text-zinc-400 underline"
            >
              Change Email
            </button>
          </form>
        )}

        <p className="text-gray-500 text-sm mt-3 mb-10">
          Already have an account?{" "}
          <span
            className="text-primary-dull cursor-pointer font-bold"
            onClick={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
