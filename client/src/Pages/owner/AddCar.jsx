import React from "react";
import { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";

const AddCar = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
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
            <input
              type="text"
              placeholder="e.g. mercedes, toyota, range rover..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>

          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g. ML350, Corolla, Prado..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
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
              onChange={(e) => setCar({ ...car, year: Number(e.target.value) })}
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
                setCar({ ...car, pricePerDay: Number(e.target.value) })
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
                setCar({ ...car, seating_capacity: Number(e.target.value) })
              }
            />
          </div>
        </div>
        {/* car location */}
        <div className="flex flex-col w-full">
          <label>Location</label>
          <select
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-transparent"
            value={car.location}
            onChange={(e) => setCar({ ...car, location: e.target.value })}
          >
            <option value="">Select a location</option>
            <option value="Abuja">Abuja</option>
            <option value="Lagos">Lagos</option>
            <option value="Benin City">Benin City</option>
            <option value="Port Harcourt">Port Harcourt</option>
          </select>
        </div>
        {/* Car Description */}
        <div className="flex flex-col w-full">
          <label>Description</label>
          <textarea
            rows={5}
            placeholder="tell us about your car "
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) =>
              setCar({ ...car, description: Number(e.target.value) })
            }
          ></textarea>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer">
          <img src={assets.tick_icon} alt="" />
          List Your Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;
