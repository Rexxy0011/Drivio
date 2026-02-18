import mongoose from "mongoose";
const { objectId } = mongoose.Schema.Types;

const carSchema = new mongoose.Schema({
  owner: { type: objectId, ref: "User", required: true },
});
