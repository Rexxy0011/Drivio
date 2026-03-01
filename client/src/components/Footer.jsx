import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500"
    >
      <div className="w-full h-px bg-primary mb-6" />

      <div className="flex flex-wrap justify-between gap-12 md:gap-8 pb-6 border-borderColor border-b">
        <div>
          <img src={assets.Driviologo1} alt="logo" className="h-6.5 md:h-9" />
          <p className="max-w-80 mt-3">
            Premium, reliable car rentals with seamless booking, transparent
            pricing, and smooth pickups—so you can drive in confidence from
            start to finish.
          </p>

          <div className="flex items-center gap-3 mt-6">
            {[
              assets.facebook_logo,
              assets.instagram_logo,
              assets.twitter_logo,
              assets.gmail_logo,
            ].map((icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={icon} alt="" className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Quick Links
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {["Home", "Browse Cars", "List your car", "About Us"].map(
              (item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Resourses
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {[
              "Help Center",
              "Terms of service",
              "Privacy Policy",
              "Insurance",
            ].map((item) => (
              <li key={item}>
                <motion.a
                  href="#"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  {item}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-medium text-gray-800 uppercase">
            Contact
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li>ademola crescent wuse zone 10.</li>
            <li>Abuja, Nigeria</li>
            <li>+234 802211221</li>
            <li>info@drivio.com</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()}Brand . All rights reserved.</p>
        <ul className="flex items-center gap-4">
          {["Privacy", "Terms", "Cookies"].map((item, idx) => (
            <React.Fragment key={item}>
              <li>
                <motion.a
                  href="#"
                  whileHover={{ opacity: 0.75 }}
                  transition={{ duration: 0.2 }}
                >
                  {item}
                </motion.a>
              </li>
              {idx < 2 && <li>|</li>}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Footer;
