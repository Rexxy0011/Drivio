import React, { useState } from "react";

const CarImageSlider = ({ images = [] }) => {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const hasMany = images.length > 1;
  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="mb-6">
      <div className="relative rounded-xl overflow-hidden shadow-md bg-light">
        <img
          src={images[index]}
          alt=""
          className="w-full h-auto md:max-h-100 object-cover"
        />

        {hasMany && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full h-9 w-9 flex items-center justify-center shadow"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full h-9 w-9 flex items-center justify-center shadow"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMany && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-lg overflow-hidden border-2 transition ${
                i === index ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-16 md:h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarImageSlider;
