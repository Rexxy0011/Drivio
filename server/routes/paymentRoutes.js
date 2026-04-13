import express from "express";
import { protect } from "../middleware/auth.js";
import {
  flutterwaveWebhook,
  verifyPayment,
} from "../controllers/PaymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/flutterwave/webhook", flutterwaveWebhook);
paymentRouter.post("/verify", protect, verifyPayment);

export default paymentRouter;
