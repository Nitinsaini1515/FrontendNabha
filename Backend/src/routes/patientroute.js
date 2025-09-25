import express from "express";
import { protect, authorizeRoles } from "../middlewares/authmiddleware.js";
import {
  checksymptoms,
  getvideos,
  searchmedicine,
  uploadrecord,
  getrecords,
  bookappointment,
  getappointments,
  getDashboardStats,
} from "../controllers/patientcontroller.js";

const router = express.Router();

// protect all routes & allow only patient role
router.use(protect, authorizeRoles("patient"));

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Appointments
router.post("/appointments", bookappointment);
router.get("/appointments", getappointments);

// Medical records
router.get("/records", getrecords);
router.post("/records", uploadrecord);

// Symptom checker
router.post("/symptom-checker", checksymptoms);

// Videos
router.get("/videos", getvideos);

// Medicine search
router.get("/medicine/:name", searchmedicine);

export default router;
