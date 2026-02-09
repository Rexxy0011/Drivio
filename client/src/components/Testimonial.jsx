import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

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
        subTitle="See why clients  choose Drivio for fast, reliable rentals."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className=" text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img key={index} src={assets.star_icon} alt="star" />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4 font-light">
              "{testimonial.testimonial}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
