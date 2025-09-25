import express from "express";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile, 
  getDoctors 
} from "../controllers/usesr.js";
import { protect, authorizeRoles} from "../middlewares/authmiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/doctors", getDoctors); // Public route to get doctors list

// Private routes (only logged in users)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Role-based routes
router.get(
  "/doctor-dashboard",
  protect,
  authorizeRoles("doctor"),
  (req, res) => {
    res.json({ message: "Welcome Doctor!" });
  }
);

export default router;
