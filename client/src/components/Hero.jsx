import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="h-screen flex flex-col items-center jutify-center gap-14  text-center">
      <h1 className="text-4xl md:text-5xl font-semibold">
        Premium Cars. Simple Rentals.
      </h1>
      <form></form>
      <img src={assets.main_car} alt="" className="max-h-74" />
    </div>
  );
};
export default Hero;
