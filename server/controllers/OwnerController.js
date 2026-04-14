import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
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

const uploadToImageKit = async (file, folder, transformation) => {
  const response = await imagekit.files.upload({
    file: fs.createReadStream(file.path),
    fileName: file.originalname,
    folder,
  });
  if (!transformation) return response.url;
  return imagekit.helper.buildSrc({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    src: response.filePath,
    transformation,
  });
};

// Api to list car (pending admin approval)
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = JSON.parse(req.body.carData);

    const imageFile = req.files?.image?.[0];
    const registrationFile = req.files?.registration?.[0];
    const insuranceFile = req.files?.insurance?.[0];

    if (!imageFile || !registrationFile || !insuranceFile) {
      return res.json({
        success: false,
        message: "Car image, registration, and insurance are all required",
      });
    }

    const [image, registration, insurance] = await Promise.all([
      uploadToImageKit(imageFile, "/cars", [
        { width: 1280, quality: "auto", format: "webp" },
      ]),
      uploadToImageKit(registrationFile, "/cars/docs"),
      uploadToImageKit(insuranceFile, "/cars/docs"),
    ]);

    await Car.create({
      ...car,
      image,
      owner: _id,
      isApproved: false,
      documents: { registration, insurance },
    });

    res.json({
      success: true,
      message: "Listing submitted — waiting for admin approval",
    });
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
    const car = await Car.findById(carId);

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
    const car = await Car.findById(carId);

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
    const { _id } = req.user;

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    // calculate monthly revenue
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
// Api to update user image

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFiles = req.file;

    const response = await imagekit.files.upload({
      file: fs.createReadStream(imageFiles.path),
      fileName: imageFiles.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [{ width: 400, quality: "auto", format: "webp" }],
    });

    const image = optimizedImageUrl;
    await User.findByIdAndUpdate(_id, { image });

    res.json({ success: true, message: "image Updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
