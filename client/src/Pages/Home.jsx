import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import FeaturedSection from "../components/FeaturedSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <FeaturedSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </>
  );
};
export default Home;
