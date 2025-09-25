import express from "express";
import { protect, authorizeRoles } from "../middlewares/authmiddleware.js";
import {
  getmedicines,
  addmedicine,
  updatemedicine,
  removemedicine,
  getOrders,
  updateOrderStatus,
  getDashboardStats,
  getLowStockMedicines,
  createOrderFromPrescription,
} from "../controllers/pharmacycontroller.js";

const router = express.Router();

// allow only pharmacy role
router.use(protect, authorizeRoles("pharmacy"));

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Medicines
router.get("/medicines", getmedicines);
router.post("/medicines", addmedicine);
router.put("/medicines/:medicineid", updatemedicine);
router.delete("/medicines/:medicineid", removemedicine);
router.get("/medicines/low-stock", getLowStockMedicines);

// Orders
router.get("/orders", getOrders);
router.put("/orders/:orderId/status", updateOrderStatus);
router.post("/orders", createOrderFromPrescription);

export default router;
