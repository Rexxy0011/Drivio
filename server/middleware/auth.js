import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.json({ success: false, message: "Not authorized" });
  }

  // Accepts: "Bearer <token>"
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : auth;

  try {
    const decoded = jwt.decode(token);
    const userId = decoded?.userId;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: "Not authorized" });
  }
};
