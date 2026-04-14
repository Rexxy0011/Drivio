import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ success: true, token });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const listPendingCars = async (req, res) => {
  try {
    const cars = await Car.find({ isApproved: false, rejectionReason: { $in: [null, ""] } })
      .populate("owner", "name email image")
      .sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const approveCar = async (req, res) => {
  try {
    const { carId } = req.body;
    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });

    car.isApproved = true;
    car.approvedAt = new Date();
    car.rejectionReason = undefined;
    await car.save();

    res.json({ success: true, message: "Listing approved" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const rejectCar = async (req, res) => {
  try {
    const { carId, reason } = req.body;
    if (!reason?.trim()) {
      return res.json({ success: false, message: "Rejection reason required" });
    }

    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });

    car.isApproved = false;
    car.rejectionReason = reason.trim();
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Listing rejected" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
