import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: ObjectId, ref: "Booking", required: true, index: true },
    user: { type: ObjectId, ref: "User", required: true },
    provider: { type: String, default: "flutterwave" },
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    status: {
      type: String,
      enum: ["initialised", "successful", "failed", "refunded"],
      default: "initialised",
    },
    flwTransactionId: { type: String },
    rawEvent: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
