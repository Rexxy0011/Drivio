import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import { verifyTransaction } from "../configs/flutterwave.js";

export const flutterwaveWebhook = async (req, res) => {
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== process.env.FLW_WEBHOOK_HASH) {
    return res.status(401).send("Invalid signature");
  }

  // Acknowledge fast; Flutterwave retries on non-2xx.
  res.status(200).send("ok");

  try {
    const event = req.body;
    const data = event?.data;
    const reference = data?.tx_ref;
    const transactionId = data?.id;
    if (!reference || !transactionId) return;

    const verification = await verifyTransaction(transactionId);
    const tx = verification?.data;

    const payment = await Payment.findOne({ reference });
    if (!payment) return;

    const booking = await Booking.findById(payment.booking);
    if (!booking) return;

    const paidAmount = Number(tx?.amount);
    const paidCurrency = tx?.currency;
    const statusOk = tx?.status === "successful";
    const amountOk = paidAmount === booking.price;
    const currencyOk = paidCurrency === "NGN";

    if (statusOk && amountOk && currencyOk) {
      if (booking.status === "pending_payment") {
        booking.status = "confirmed";
        booking.flwTransactionId = String(transactionId);
        await booking.save();
      }
      payment.status = "successful";
      payment.flwTransactionId = String(transactionId);
      payment.rawEvent = event;
      await payment.save();
    } else {
      payment.status = "failed";
      payment.rawEvent = event;
      await payment.save();
    }
  } catch (err) {
    console.error("Webhook processing error:", err.message);
  }
};

// Optional: frontend calls this after the inline modal closes to speed up confirmation
// (webhook is still the source of truth).
export const verifyPayment = async (req, res) => {
  try {
    const { transactionId, reference } = req.body;
    if (!transactionId || !reference) {
      return res.json({ success: false, message: "Missing parameters" });
    }

    const payment = await Payment.findOne({ reference });
    if (!payment || payment.user.toString() !== req.user._id.toString()) {
      return res.json({ success: false, message: "Payment not found" });
    }

    const booking = await Booking.findById(payment.booking);
    if (!booking) return res.json({ success: false, message: "Booking not found" });

    if (booking.status === "confirmed") {
      return res.json({ success: true, status: "confirmed" });
    }

    const verification = await verifyTransaction(transactionId);
    const tx = verification?.data;

    if (
      tx?.status === "successful" &&
      Number(tx?.amount) === booking.price &&
      tx?.currency === "NGN"
    ) {
      booking.status = "confirmed";
      booking.flwTransactionId = String(transactionId);
      await booking.save();

      payment.status = "successful";
      payment.flwTransactionId = String(transactionId);
      await payment.save();

      return res.json({ success: true, status: "confirmed" });
    }

    return res.json({ success: false, message: "Payment not successful yet" });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};
