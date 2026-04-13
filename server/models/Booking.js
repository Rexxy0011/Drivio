import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    car: { type: ObjectId, ref: "Car", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    owner: { type: ObjectId, ref: "User", required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending_payment", "pending", "confirmed", "cancelled", "refunded"],
      default: "pending_payment",
    },
    price: { type: Number, required: true },
    paymentExpiresAt: { type: Date },
    paymentReference: { type: String, index: true },
    flwTransactionId: { type: String },
    refundId: { type: String },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
