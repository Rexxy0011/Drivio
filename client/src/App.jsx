import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import CarDetails from "./Pages/CarDetails";
import Cars from "./Pages/Cars";
import MyBookings from "./Pages/MyBookings";
import Footer from "./components/Footer";
import Layout from "./Pages/owner/Layout";
import Dashboard from "./Pages/owner/Dashboard";
import AddCar from "./Pages/owner/AddCar";
import ManageCars from "./Pages/owner/ManageCars";
import ManageBookings from "./Pages/owner/ManageBookings";
import AdminLogin from "./Pages/AdminLogin";
import Admin from "./Pages/Admin";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { showLogin, setShowLogin } = useAppContext();
  const path = useLocation().pathname;
  const isOwnerPath = path.startsWith("/owner");
  const isAdminPath = path.startsWith("/admin");
  const hideChrome = isOwnerPath || isAdminPath;

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <Toaster />

      {showLogin && <Login setShowLogin={setShowLogin} />}

      {!hideChrome && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {!hideChrome && <Footer />}
    </div>
  );
};

export default App;
