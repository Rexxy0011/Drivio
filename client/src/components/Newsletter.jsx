import React from "react";
import { motion } from "framer-motion";

const Newsletter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-40"
    >
      <h1 className="md:text-4xl text-2xl font-semibold">Get Deals First.</h1>
      <p className="md:text-md text-gray-500/70 pb-8">
        Join the Drivio list for new listings, limited-time offers, and
        exclusive discounts.
      </p>

      <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
        <input
          className="border border-gray-300 rounded-full h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="text"
          placeholder="Enter your email"
          required
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Newsletter;
