import React, { useMemo, useState } from "react";
import { assets, cityList } from "../assets/assets";
import dayjs from "dayjs";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";
import DateField, { startOfToday } from "./DateField";

const Hero = () => {
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
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
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
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl md:rounded-full w-full max-w-80 md:max-w-3xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] gap-4 md:gap-2"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 md:ml-4 w-full md:w-auto">
          <div className="flex flex-col items-start gap-2 w-full md:w-auto">
            <label className="text-sm text-gray-500">Pickup location</label>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="border border-borderColor px-3 py-2.5 rounded-lg bg-white text-gray-800 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition min-w-44"
            >
              <option value="">Select city</option>
              {cityList.map((city, i) => (
                <option key={i} value={city}>
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
          />

          <DateField
            label="Return date"
            value={returnDate}
            onChange={setReturnDate}
            minDate={minReturnDate}
            placeholder="Select return"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-1 px-9 py-3 max-md:mt-2 max-md:w-full bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="brightness-300"
          />
          Search
        </motion.button>
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
