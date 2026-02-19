import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import fs from "fs";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "  Now you can list cars" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to list car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFiles = req.file;

    // upload images to imagekit
    const response = await imagekit.files.upload({
      file: fs.createReadStream(imageFiles.path),
      fileName: imageFiles.originalname,
      folder: "/cars",
    });

    // optimize through imagekit transformation
    const optimizedImageUrl = imagekit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath, // path of the uploaded file returned by ImageKit
      transformation: [{ width: 1280, quality: "auto", format: "webp" }],
    });

    const image = optimizedImageUrl;
    await Car.create({ ...car, image, owner: _id });
    res.json({ success: true, message: "Car Added " });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Api to list owner's cars

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
// Api to Toggle car availability

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById({ carId });

    // checking if the car belongs to the owner

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Not authorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Car availability toggled" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to delete a car

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById({ carId });

    // checking if the car belongs to the owner

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Not authorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Dashboard data

export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Not authorized" });
    }

    const cars = await Car.find({ owner: _id });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
