import express from "express";
import { protect } from "../middleware/auth.js";
import { changeRoleToOwner } from "../controllers/OwnerController.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);

export default ownerRouter;
