import crypto from "crypto";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Payment from "../models/Payment.js";
import { refundTransaction } from "../configs/flutterwave.js";

const PAYMENT_HOLD_MINUTES = 15;
const ACTIVE_STATUSES = ["pending", "confirmed"];

// A booking holds a slot if it is confirmed, pending, or still within its payment window.
const activeHoldFilter = () => ({
  $or: [
    { status: { $in: ACTIVE_STATUSES } },
    {
      status: "pending_payment",
      paymentExpiresAt: { $gt: new Date() },
    },
  ],
});

const checkAvailability = async (car, pickupDate, returnDate) => {
  const conflicts = await Booking.find({
    car,
    pickupDate: { $lt: returnDate },
    returnDate: { $gt: pickupDate },
    ...activeHoldFilter(),
  });
  return conflicts.length === 0;
};

// api to check availability of a car for a given date range and location
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { country, location, pickupDate, returnDate } = req.body;

    const query = { isAvailable: true, isApproved: true };
    if (country) query.country = country;
    if (location) query.location = location;

    const cars = await Car.find(query);

    const availabilityChecks = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availabilityChecks);
    availableCars = availableCars.filter((car) => car.isAvailable);

    res.json({ success: true, cars: availableCars });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to create a booking and initialise a Flutterwave payment
export const bookCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (!carData.isApproved) {
      return res.json({ success: false, message: "This car is not available for booking" });
    }

    if (carData.owner.toString() === _id.toString()) {
      return res.json({ success: false, message: "You can't book your own car" });
    }

    const pickup = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - pickup) / (1000 * 60 * 60 * 24));
    if (noOfDays <= 0) {
      return res.json({ success: false, message: "Invalid date range" });
    }

    const price = carData.pricePerDay * noOfDays;
    const reference = `drivio_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
    const paymentExpiresAt = new Date(
      Date.now() + PAYMENT_HOLD_MINUTES * 60 * 1000
    );

    const booking = await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
      status: "pending_payment",
      paymentReference: reference,
      paymentExpiresAt,
    });

    await Payment.create({
      booking: booking._id,
      user: _id,
      reference,
      amount: price,
      currency: "NGN",
    });

    res.json({
      success: true,
      booking: {
        _id: booking._id,
        reference,
        amount: price,
        currency: "NGN",
        expiresAt: paymentExpiresAt,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to list user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to list owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Not authorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to change booking status (owner cancels -> auto refund)
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const wasConfirmed = booking.status === "confirmed";
    const cancelling = status === "cancelled";

    if (cancelling && wasConfirmed && booking.flwTransactionId) {
      try {
        const refund = await refundTransaction(booking.flwTransactionId);
        const refundId = refund?.data?.id ? String(refund.data.id) : undefined;

        booking.status = "refunded";
        if (refundId) booking.refundId = refundId;
        await booking.save();

        await Payment.findOneAndUpdate(
          { booking: booking._id },
          { status: "refunded" }
        );

        return res.json({
          success: true,
          message: "Booking cancelled and refund initiated",
        });
      } catch (err) {
        console.error("Refund failed:", err.response?.data || err.message);
        return res.json({
          success: false,
          message: "Refund failed — booking not cancelled",
        });
      }
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "status updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
