/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Cars from "./pages/Cars.jsx";
import CarDetails from "./pages/CarDetails.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Footer from "./components/Footer.jsx";
import Dashboard from "./pages/owner/Dashboard.jsx";
import Layout from "./pages/owner/Layout.jsx";
import AddCar from "./pages/owner/AddCar.jsx";
import ManageCars from "./pages/owner/ManageCars.jsx";
import ManageBookings from "./pages/owner/ManageBookings.jsx";
import Messages from "./pages/owner/Messages.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import BecomeAHost from "./pages/BecomeAHost.jsx";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import CustomCursor from "./components/CustomCursor";

const App = () => {
  const { showLogin, showSignup } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  return (
    <>
      <CustomCursor />
      <Toaster />
      {showLogin && <Login />}
      {showSignup && <Signup />}
      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/become-a-host" element={<BecomeAHost />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
