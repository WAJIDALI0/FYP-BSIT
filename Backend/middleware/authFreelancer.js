import jwt from "jsonwebtoken";
import Freelancer from "../models/Freelancer.js";

export const protectFreelancer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const freelancer = await Freelancer.findById(decoded.id).select("-password");

      if (!freelancer) {
        return res.status(404).json({ message: "Freelancer not found" });
      }

      req.user = { id: freelancer._id, role: "freelancer" }; // Attach user info to request
      return next(); // ✅ Exit successfully

    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // ✅ Only reach here if no token was provided at all
  return res.status(401).json({ message: "Not authorized, no token provided" });
};
