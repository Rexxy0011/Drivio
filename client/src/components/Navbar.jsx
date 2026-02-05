import React from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className= {`flex items-center justify-between px-6 md:px-16 lg:px-24xl : px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>
      
      <Link to="/">
        <img src={assets.logo} alt="" className="h-8" />
      </Link>

      <div
        className={`
        max-sm:fixed max-sm:top-16 max-sm:right-0 
        max-sm:h-screen max-sm:w-full 
        flex flex-col sm:flex-row 
        items-start sm:items-center 
        gap-4 sm:gap-8 
        max-sm:p-6
        transition-all duration-300 z-50
        ${location.pathname === "/" ? "bg-light" : "bg-white"}
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}
      `}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} className="text-sm font-medium hover:opacity-70 transition">
            {link.name}
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Navbar;
