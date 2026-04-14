import React from "react";
import { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { carBrands } from "../../assets/carBrands";
import { countries, countryList } from "../../assets/countries";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const DESCRIPTION_MIN = 40;
const brandList = Object.keys(carBrands);

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    country: "",
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoading) return null;

    const required = [
      ["brand", "brand"],
      ["model", "model"],
      ["year", "year"],
      ["pricePerDay", "price per day"],
      ["category", "category"],
      ["transmission", "transmission"],
      ["fuel_type", "fuel type"],
      ["seating_capacity", "seating capacity"],
      ["country", "country"],
      ["location", "city"],
    ];
    for (const [key, label] of required) {
      if (car[key] === "" || car[key] === undefined || car[key] === null) {
        toast.error(`Please fill in ${label}`);
        return;
      }
    }

    if (Number(car.year) <= 0 || Number(car.pricePerDay) <= 0 || Number(car.seating_capacity) <= 0) {
      toast.error("Year, price, and seating must be positive numbers");
      return;
    }

    if (car.description.trim().length < DESCRIPTION_MIN) {
      toast.error(`Description must be at least ${DESCRIPTION_MIN} characters`);
      return;
    }

    if (!image || !registration || !insurance) {
      toast.error("Upload car photo, registration, and insurance");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("registration", registration);
      formData.append("insurance", insurance);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setRegistration(null);
        setInsurance(null);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          country: "",
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="fill in details to list a new car for booking, including pricing, availability, and car specs"
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              className="h-14 rounded cursor-pointer"
              alt="upload"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="text-sm text-gray-500">Upload a picture of your car</p>
        </div>

        {/* car brand & model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent"
              value={car.brand}
              onChange={(e) =>
                setCar({ ...car, brand: e.target.value, model: "" })
              }
            >
              <option value="">Select a brand</option>
              {brandList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label>Model</label>
            <select
              required
              disabled={!car.brand}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent disabled:opacity-60"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            >
              <option value="">
                {car.brand ? "Select a model" : "Pick a brand first"}
              </option>
              {car.brand &&
                carBrands[car.brand].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* car year , price , category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="e.g. 2022"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) =>
                setCar({
                  ...car,
                  year: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </div>

          <div className="flex flex-col w-full">
            <label>Price Per Day({currency})</label>
            <input
              type="number"
              placeholder="e.g. 150000"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) =>
                setCar({
                  ...car,
                  pricePerDay:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </div>

          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent"
              value={car.category}
              onChange={(e) => setCar({ ...car, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Coupe">Coupe</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

        {/* car Transmission, Fuel Type, Seating Capacity  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent"
              value={car.transmission}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            >
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent"
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
            >
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="petrol">petrol</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>
            <input
              type="number"
              placeholder="4"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({
                  ...car,
                  seating_capacity:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* country & city */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Country</label>
            <select
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent"
              value={car.country}
              onChange={(e) =>
                setCar({ ...car, country: e.target.value, location: "" })
              }
            >
              <option value="">Select a country</option>
              {countryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label>City</label>
            <select
              required
              disabled={!car.country}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent disabled:opacity-60"
              value={car.location}
              onChange={(e) => setCar({ ...car, location: e.target.value })}
            >
              <option value="">
                {car.country ? "Select a city" : "Pick a country first"}
              </option>
              {car.country &&
                countries[car.country].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Car Description */}
        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            rows={5}
            placeholder="Describe condition, comfort, features, mileage…"
            required
            minLength={DESCRIPTION_MIN}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          />
          <p
            className={`text-xs mt-1 ${
              car.description.trim().length >= DESCRIPTION_MIN
                ? "text-gray-400"
                : "text-amber-500"
            }`}
          >
            {car.description.trim().length}/{DESCRIPTION_MIN} characters minimum
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-2 border-t border-borderColor/60">
          <div>
            <p className="text-gray-700 font-medium">Required documents</p>
            <p className="text-xs text-gray-500 mt-1">
              Both are reviewed by an admin before your listing goes live. PDF or image is fine.
            </p>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="registration-file">Vehicle registration</label>
            <input
              id="registration-file"
              type="file"
              accept="image/*,application/pdf"
              required
              onChange={(e) => setRegistration(e.target.files[0] || null)}
              className="mt-1 text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-primary hover:file:bg-primary/15"
            />
            {registration && (
              <p className="text-xs text-gray-500 mt-1 truncate">{registration.name}</p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="insurance-file">Proof of insurance</label>
            <input
              id="insurance-file"
              type="file"
              accept="image/*,application/pdf"
              required
              onChange={(e) => setInsurance(e.target.files[0] || null)}
              className="mt-1 text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-primary hover:file:bg-primary/15"
            />
            {insurance && (
              <p className="text-xs text-gray-500 mt-1 truncate">{insurance.name}</p>
            )}
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer">
          <img src={assets.tick_icon} alt="" />
          {isLoading ? "submitting.." : "Submit for review"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
