import axios from "axios";

const FLW_BASE = "https://api.flutterwave.com/v3";

const client = () =>
  axios.create({
    baseURL: FLW_BASE,
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

export const verifyTransaction = async (transactionId) => {
  const { data } = await client().get(`/transactions/${transactionId}/verify`);
  return data;
};

export const refundTransaction = async (transactionId, amount) => {
  const { data } = await client().post(
    `/transactions/${transactionId}/refund`,
    amount ? { amount } : {}
  );
  return data;
};
