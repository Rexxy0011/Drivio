import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Joyce Adebayo",
      location: "Abuja, Nigeria",
      image: assets.test3,
      rating: 5,
      testimonial:
        "Drivio made renting a car feel effortless. I booked in minutes, the pickup was smooth, and the car quality matched exactly what was listed. Super clean experience.",
    },
    {
      id: 2,
      name: "Kennedy Okon",
      location: "Lagos, Nigeria",
      image: assets.test2,
      rating: 4,
      testimonial:
        "What I liked most is how transparent everything is—pricing, dates, and the whole process. Drivio’s flow is simple and professional, and support was quick when I had a question.",
    },
    {
      id: 3,
      name: "veritus voko",
      location: "Benin City, Nigeria",
      image: assets.test1,
      rating: 5,
      testimonial:
        "Drivio feels modern and trustworthy. From choosing the car to confirming the rental, everything was clear and fast. It’s the kind of platform you can confidently recommend.",
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What Our Customers Say"
        subTitle="See why clients choose Drivio for fast, reliable rentals."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
      >
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            variants={{
              hidden: { opacity: 0, y: 28, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            whileHover={{ y: -6, rotate: -0.4 }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex items-center gap-1 mt-4"
            >
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <motion.img
                    key={index}
                    src={assets.star_icon}
                    alt="star"
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                  />
                ))}
            </motion.div>

            <p className="text-gray-500 max-w-90 mt-4 font-light">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonial;
