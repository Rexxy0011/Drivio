import express from "express";
import { protect, requireAdmin } from "../middleware/auth.js";
import {
  adminLogin,
  listPendingCars,
  approveCar,
  rejectCar,
} from "../controllers/AdminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/pending-cars", protect, requireAdmin, listPendingCars);
adminRouter.post("/approve-car", protect, requireAdmin, approveCar);
adminRouter.post("/reject-car", protect, requireAdmin, rejectCar);

export default adminRouter;
