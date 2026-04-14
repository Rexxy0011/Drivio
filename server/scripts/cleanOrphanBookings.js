import "dotenv/config";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

async function run() {
  await mongoose.connect(`${process.env.MONGODB_URI}/Drivio`);
  console.log("Connected to Mongo");

  const validIds = await Car.distinct("_id");
  const result = await Booking.deleteMany({ car: { $nin: validIds } });
  console.log(`Removed ${result.deletedCount} bookings pointing at deleted cars`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
