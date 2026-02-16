import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

// initialize express app

const app = express();

await connectDB();

// middleware

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("server is running"));

const PORT = process.env.PORT || 30000;
app.listen(PORT, () =>
  console.log(`server running on port ${PORT}
  
  `)
);
