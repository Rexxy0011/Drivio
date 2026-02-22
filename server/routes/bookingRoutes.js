import express from "express";
import {
  checkAvailabilityOfCar,
  bookCar,
  getOwnerBookings,
  getUserBookings,
  changeBookingStatus,
} from "../controllers/BookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCar);
bookingRouter.post("/create", protect, bookCar);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;
