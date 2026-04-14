import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema(
  {
    owner: { type: ObjectId, ref: "User" },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    seating_capacity: { type: Number, required: true },
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    country: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true, minlength: 40 },
    isAvailable: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    documents: {
      registration: { type: String },
      insurance: { type: String },
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
