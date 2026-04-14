import React, { useEffect, useMemo, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { countries, countryList } from "../assets/countries";

const CATEGORIES = ["Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Van"];
const TRANSMISSIONS = ["Automatic", "Manual"];

const Cars = () => {
  // getting search params from url
  const [searchParams] = useSearchParams();
  const pickupCountry = searchParams.get("country");
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState("");
  const [baseCars, setBaseCars] = useState([]);

  const [country, setCountry] = useState(pickupCountry || "");
  const [city, setCity] = useState(pickupLocation || "");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const isSearchData =
    (pickupCountry || pickupLocation) && pickupDate && returnDate;

  const filteredCars = useMemo(() => {
    const needle = input.trim().toLowerCase();
    const max = maxPrice === "" ? Infinity : Number(maxPrice);

    return baseCars.filter((car) => {
      if (country && car.country !== country) return false;
      if (city && car.location !== city) return false;
      if (category && car.category !== category) return false;
      if (transmission && car.transmission !== transmission) return false;
      if (Number(car.pricePerDay) > max) return false;

      if (needle) {
        const haystack = [
          car.brand,
          car.model,
          car.transmission,
          car.category,
          car.location,
          car.country,
          car.fuel_type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }

      return true;
    });
  }, [baseCars, input, country, city, category, transmission, maxPrice]);

  const clearFilters = () => {
    setCountry("");
    setCity("");
    setCategory("");
    setTransmission("");
    setMaxPrice("");
    setInput("");
  };

  const hasActiveFilters =
    input || country || city || category || transmission || maxPrice;

  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        country: pickupCountry,
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setBaseCars(data.cars);
        if (data.cars.length === 0) {
          toast.error("No cars available");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else {
      setBaseCars(cars);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchData, cars]);

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Find the right ride in seconds—premium options, transparent pricing, ready to go."
        />
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search make, model, city, country…"
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </div>

        <div className="mt-6 w-full max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCity("");
              }}
              className="border border-borderColor bg-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
            >
              <option value="">All countries</option>
              {countryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!country}
              className="border border-borderColor bg-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary disabled:opacity-60"
            >
              <option value="">{country ? "All cities" : "Any city"}</option>
              {country &&
                countries[country].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-borderColor bg-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
            >
              <option value="">Any category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="border border-borderColor bg-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
            >
              <option value="">Any transmission</option>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              placeholder="Max price / day"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-borderColor bg-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car) => (
            <div key={car._id}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
