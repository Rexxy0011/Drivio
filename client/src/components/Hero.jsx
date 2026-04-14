import React, { useMemo, useState } from "react";
import { assets } from "../assets/assets";
import { countries, countryList } from "../assets/countries";
import dayjs from "dayjs";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import DateField, { startOfToday } from "./DateField";

const Hero = () => {
  const [pickupCountry, setPickupCountry] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  const today = useMemo(() => startOfToday(), []);
  const minReturnDate = useMemo(() => {
    if (!pickupDate) return today;
    const d = new Date(pickupDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [pickupDate, today]);

  const handlePickupChange = (next) => {
    setPickupDate(next);
    if (returnDate && dayjs(returnDate).isBefore(dayjs(next).add(1, "day"))) {
      setReturnDate("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      country: pickupCountry,
      pickupLocation,
      pickupDate,
      returnDate,
    });
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center gap-14  text-center"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold"
      >
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
      </motion.h1>

      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        onSubmit={handleSearch}
        className="relative z-10 w-full max-w-sm md:max-w-5xl bg-white rounded-2xl shadow-[0px_8px_20px_rgba(0,0,0,0.1)] p-5 md:p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-[repeat(4,minmax(0,1fr))_auto] gap-4 md:gap-3 md:items-end">
          <div className="flex flex-col items-start gap-1.5">
            <label className="text-xs text-gray-500">Country</label>
            <select
              required
              value={pickupCountry}
              onChange={(e) => {
                setPickupCountry(e.target.value);
                setPickupLocation("");
              }}
              className="w-full border border-borderColor px-3 py-2.5 rounded-lg bg-white text-gray-800 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            >
              <option value="">Select country</option>
              {countryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-start gap-1.5">
            <label className="text-xs text-gray-500">City</label>
            <select
              required
              disabled={!pickupCountry}
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full border border-borderColor px-3 py-2.5 rounded-lg bg-white text-gray-800 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:opacity-60"
            >
              <option value="">
                {pickupCountry ? "Select city" : "Pick country first"}
              </option>
              {pickupCountry &&
                countries[pickupCountry].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>

          <DateField
            label="Pick-up date"
            value={pickupDate}
            onChange={handlePickupChange}
            minDate={today}
            placeholder="Select pickup"
            className="w-full"
          />

          <DateField
            label="Return date"
            value={returnDate}
            onChange={setReturnDate}
            minDate={minReturnDate}
            placeholder="Select return"
            className="w-full"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-6 h-[46px] w-full md:w-auto bg-primary hover:bg-primary-dull text-white rounded-lg cursor-pointer font-medium"
          >
            <img
              src={assets.search_icon}
              alt=""
              className="brightness-300 h-4"
            />
            Search
          </motion.button>
        </div>
      </motion.form>

      <motion.img
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        src={assets.main_car}
        alt=""
        className="max-h-74"
      />
    </motion.div>
  );
};

export default Hero;
