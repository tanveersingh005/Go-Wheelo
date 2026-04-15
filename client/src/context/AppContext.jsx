/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8001/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [pickUpDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);
  const [ownerCars, setOwnerCars] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setIsOwner(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsOwner(false);
        navigate("/");
      }
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsOwner(false);
    }
  };

  const fetchOwnerData = async () => {
    if (!token) return;
    try {
      const [{ data: carsData }, { data: bookingsData }] = await Promise.all([
        axios.get("/api/owner/cars", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/bookings/owner", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (carsData.success) setOwnerCars(carsData.cars);
      if (bookingsData.success) setOwnerBookings(bookingsData.bookings);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchAllCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // function to logout the user //

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = '';
    toast.success("Logged out successfully");
    navigate("/");
  }

  // ─── Initial load: pull token from storage + all cars ──────────────────────
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
    fetchAllCars();
  }, []);

  // ─── On token change: set auth header + fetch user / owner data ────────────
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
      fetchOwnerData();
    }
  }, [token]);

  // ─── Live polling: refresh public cars list every 15 s ─────────────────────
  useEffect(() => {
    const carInterval = setInterval(fetchAllCars, 15000);
    return () => clearInterval(carInterval);
  }, []);

  // ─── Live polling: refresh owner data every 15 s (only when logged in) ─────
  useEffect(() => {
    if (!token) return;
    const ownerInterval = setInterval(fetchOwnerData, 15000);
    return () => clearInterval(ownerInterval);
  }, [token]);

  // ─── Page Visibility API: instant refresh when user switches back to tab ───
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchAllCars();
        if (token) fetchOwnerData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [token]);

  const value = {
    axios, currency, token, setToken, user, setUser, isOwner, setIsOwner, showLogin,
    setShowLogin, showSignup, setShowSignup, pickUpDate, setPickupDate, returnDate, setReturnDate, cars,
    setCars, fetchUser, logout, ownerCars, setOwnerCars, ownerBookings, setOwnerBookings, fetchOwnerData, fetchAllCars
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
