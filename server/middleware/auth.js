import jwt from "jsonwebtoken";
import User from "../models/User.js";

const unauthorized = (res) =>
  res.status(401).json({ success: false, message: "Not authorized" });

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) return unauthorized(res);

  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : auth;

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) return unauthorized(res);

    const user = await User.findById(userId).select("-password");
    if (!user) return unauthorized(res);

    req.user = user;
    next();
  } catch (error) {
    return unauthorized(res);
  }
};

export const requireOwner = (req, res, next) => {
  if (req.user?.role !== "owner") {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  next();
};
