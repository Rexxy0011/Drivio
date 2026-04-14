import React from "react";
import { motion } from "motion/react";

const values = [
  {
    badge: "01",
    tag: "Trust",
    title: "Verified by default",
    body: "Every host submits vehicle registration and proof of insurance. Our team reviews each listing before it goes public, so the car on your screen is the car at the curb.",
    accent: "from-primary/20 via-primary/5",
  },
  {
    badge: "02",
    tag: "Price",
    title: "No surprises at checkout",
    body: "One daily rate. One total. No service fees materialising after you pay. You see exactly what you owe before you hit confirm.",
    accent: "from-blue-400/20 via-blue-400/5",
  },
  {
    badge: "03",
    tag: "Payments",
    title: "Refunds that actually refund",
    body: "A fifteen-minute hold gives you time to pay through Flutterwave. Cancel or get cancelled on, and your refund processes automatically, no waiting on someone to remember.",
    accent: "from-indigo-400/20 via-indigo-400/5",
  },
];

const steps = [
  { n: "01", t: "Browse", d: "Search cars by country, city, dates, or category." },
  { n: "02", t: "Book", d: "Pick your dates, see the full price, reserve in seconds." },
  { n: "03", t: "Pay", d: "Checkout is secured and processed by Flutterwave." },
  { n: "04", t: "Drive", d: "Meet the host, grab the keys, hit the road." },
];

const About = () => {
  return (
    <section id="about" className="px-6 md:px-16 lg:px-24 xl:px-32 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary">
            About Drivio
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-3 leading-tight">
            Africa's peer-to-peer car rental, built on{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--color-primary), var(--color-primary-dull))",
              }}
            >
              trust and speed.
            </span>
          </h2>
          <p className="text-gray-500 text-lg mt-4">
            Drivio connects travellers and locals with verified vehicle owners
            across six African countries. Whether you need an SUV in Lagos for
            the weekend, a city car in Cairo for a meeting, or something fun in
            Marrakech: list it, book it, drive it. No dealership counters,
            no paperwork pile-ups.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-3xl border border-borderColor/60 bg-white p-7 transition-shadow hover:shadow-2xl ${
                i === 1 ? "md:translate-y-6" : ""
              }`}
            >
              <div
                className={`pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-linear-to-br ${v.accent} to-transparent blur-2xl`}
              />
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-linear-to-r ${v.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary font-semibold">
                    {v.badge}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    {v.tag}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-800 leading-snug">
                  {v.title}
                </h3>
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                  {v.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-gray-800 text-center">
            How it works
          </h3>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative pl-6"
              >
                <span
                  className="absolute left-0 top-1 text-xs font-semibold tracking-widest text-primary"
                >
                  {s.n}
                </span>
                <p className="text-base font-semibold text-gray-800">{s.t}</p>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {s.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
