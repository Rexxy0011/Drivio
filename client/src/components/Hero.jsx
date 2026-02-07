import React from "react";
import { assets, cityList } from "../assets/assets";
import { useState } from "react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-14  text-center">
      <h1 className="text-4xl md:text-5xl font-semibold">
        Premium Cars.{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--color-primary), var(--color-primary-dull))",
          }}
        >
          Simple Rentals.
        </span>
      </h1>

      <form className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
          <div className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="">Pickup Location</option>
              {cityList.map((city) => (
                <option value={city}>{city}</option>
              ))}
            </select>
            <p className="px-1 text-sm text-gray-500">
              {pickupLocation ? pickupLocation : "Please select location"}
            </p>
          </div>
        </div>
      </form>
      <img src={assets.main_car} alt="" className="max-h-74" />
    </div>
  );
};
export default Hero;
