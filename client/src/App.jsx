import React from "react";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import CarDetails from "./Pages/CarDetails";
import Cars from "./Pages/Cars";
import MyBookings from "./Pages/MyBookings";
import Footer from "./components/Footer";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const isOnwerPath = useLocation().pathname.startsWith("/owner");

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <>
        {!isOnwerPath && <Navbar setShowLogin={setShowLogin} />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car-details/:id" element={<CarDetails />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
        {!isOnwerPath && <Footer />}
      </>
    </div>
  );
};
export default App;
